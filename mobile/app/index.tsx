import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { BarChart } from 'react-native-gifted-charts';

interface OperationalData {
  id: number;
  line: string;
  suhu: number;
  berat: number;
  group: string;
  shift: number;
  kualitas: string;
}

const API_URL = 'http://192.168.0.190:5000/api'; 
const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [master, setMaster] = useState({ groups: [], shifts: [], lines: [] });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [chartData, setChartData] = useState<any[]>([]);

  const [form, setForm] = useState({
    group: '', shift: '', line: '', suhu: '', berat: '', kualitas: 'OK'
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState(''); 
  const [pickerOptions, setPickerOptions] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const resMaster = await axios.get(`${API_URL}/master`);
      setMaster(resMaster.data);

      const resData = await axios.get(`${API_URL}/data`);
      processChartData(resData.data);

    } catch (err) {
      console.log("Error fetch:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  const processChartData = (data: OperationalData[]) => {
    const recentData = data.slice(-5); 
    
    if (recentData.length > 0) {
      const formattedData = recentData.map(item => ({
        value: item.suhu,
        label: item.line,
        frontColor: item.kualitas === 'OK' ? '#10b981' : '#ef4444',
        topLabelComponent: () => (
            <Text style={{color: 'gray', fontSize: 10, marginBottom: 2}}>{item.suhu}</Text>
        )
      }));
      
      setChartData(formattedData);
    }
  };

  const handleOCR = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) { Alert.alert("Izin Ditolak", "Anda menolak akses kamera."); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6, base64: true });

    if (!result.canceled) {
      setLoading(true);
      try {
        const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const formData = new FormData();
        formData.append('base64Image', base64Img);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('scale', 'true'); 
        formData.append('OCREngine', '2'); 
        const API_KEY = 'K81502281388957';
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: { 'apikey': API_KEY, 'Content-Type': 'multipart/form-data'}
        });
        const parsedResults = response.data.ParsedResults;
        if (parsedResults && parsedResults.length > 0) {
            const textDetected = parsedResults[0].ParsedText;
            const match = textDetected.match(/[0-9]+([.,][0-9]+)?/);
            if (match) {
                const cleanNumber = match[0].replace(',', '.');
                setForm(prev => ({ ...prev, berat: cleanNumber }));
                Alert.alert("OCR Sukses", `Angka: ${cleanNumber}`);
            } else { Alert.alert("Gagal", "Tidak ada angka terdeteksi."); }
        } 
      } catch (error) { Alert.alert("Error", "Gagal koneksi OCR."); } 
      finally { setLoading(false); }
    }
  };

  const handleSubmit = async () => {
     if (!form.group || !form.shift || !form.line || !form.suhu || !form.berat) {
      Alert.alert("Data Belum Lengkap", "Harap isi semua kolom!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/data`, { ...form, suhu: parseInt(form.suhu), berat: parseFloat(form.berat) });
      Alert.alert("Sukses", "Data terkirim!");
      setForm(prev => ({ ...prev, suhu: '', berat: '' })); 
      fetchAllData();
    } catch (err) { Alert.alert("Gagal", "Error kirim data."); } 
    finally { setLoading(false); }
  };

  const openPicker = (type: string) => {
    setPickerType(type);
    if (type === 'group') setPickerOptions(master.groups);
    if (type === 'shift') setPickerOptions(master.shifts);
    if (type === 'line') setPickerOptions(master.lines);
    setModalVisible(true);
  };

  const selectOption = (item: any) => {
    setForm({ ...form, [pickerType]: item });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        <Text style={styles.headerTitle}>Mobile Dashboard</Text>

        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Monitoring Suhu (5 Data Terakhir)</Text>
            {chartData.length > 0 ? (
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <BarChart
                        key={JSON.stringify(chartData)} 
                        data={chartData}
                        barWidth={30}
                        noOfSections={4}
                        barBorderRadius={4}
                        frontColor="#10b981"
                        yAxisThickness={0}
                        xAxisThickness={0}
                        yAxisTextStyle={{color: '#999'}}
                        xAxisLabelTextStyle={{color: '#555'}}
                        width={screenWidth - 80}
                        height={200}
                        spacing={30}
                        maxValue={Math.max(...chartData.map(d => d.value)) + 5} 
                        isAnimated
                        animationDuration={500}
                    />
                    
                    <View style={{flexDirection:'row', gap:15, marginTop:10}}>
                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                            <View style={{width:10, height:10, backgroundColor:'#10b981', borderRadius:2}}/>
                            <Text style={{fontSize:10, color:'#555'}}>OK</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                            <View style={{width:10, height:10, backgroundColor:'#ef4444', borderRadius:2}}/>
                            <Text style={{fontSize:10, color:'#555'}}>NOT OK</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <Text style={{textAlign:'center', color:'#999', marginVertical: 20}}>Belum ada data</Text>
            )}
        </View>

        <Text style={styles.subHeader}>Input Data Operasional</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.input, styles.halfInput]} onPress={() => openPicker('group')}>
              <Text style={styles.label}>Group</Text>
              <Text style={styles.value}>{form.group || "Pilih..."}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.input, styles.halfInput]} onPress={() => openPicker('shift')}>
              <Text style={styles.label}>Shift</Text>
              <Text style={styles.value}>{form.shift || "Pilih..."}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.input} onPress={() => openPicker('line')}>
            <Text style={styles.label}>Production Line</Text>
            <Text style={styles.value}>{form.line || "Pilih Line (A-M)"}</Text>
          </TouchableOpacity>

          <View style={styles.input}>
            <Text style={styles.label}>Suhu (°C)</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="0" 
              keyboardType="number-pad"
              value={form.suhu}
              onChangeText={(t) => setForm({...form, suhu: t})}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Berat (kg) - OCR</Text>
            <View style={styles.rowCenter}>
              <TextInput 
                style={[styles.textInput, { flex: 1, backgroundColor: '#f0f0f0', color: '#555' }]}
                placeholder="Scan via OCR..." 
                editable={false} 
                value={form.berat.toString()}
              />
              <TouchableOpacity style={styles.ocrButton} onPress={handleOCR}>
                <Text style={styles.ocrButtonText}>📷 SCAN</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Quality Check Result</Text>
          <View style={styles.qualityContainer}>
            <TouchableOpacity 
              style={[styles.qualityBtn, form.kualitas === 'OK' && styles.qualityOk]}
              onPress={() => setForm({...form, kualitas: 'OK'})}>
              <Text style={[styles.qualityText, form.kualitas === 'OK' && styles.textWhite]}>OK</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.qualityBtn, form.kualitas === 'NOT OK' && styles.qualityNotOk]}
              onPress={() => setForm({...form, kualitas: 'NOT OK'})}>
              <Text style={[styles.qualityText, form.kualitas === 'NOT OK' && styles.textWhite]}>NOT OK</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, form.kualitas === 'NOT OK' ? styles.btnRed : styles.btnBlue]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.submitText}>
                {form.kualitas === 'NOT OK' ? 'SUBMIT REJECT' : 'SUBMIT DATA'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih {pickerType.toUpperCase()}</Text>
            <ScrollView>
              {pickerOptions.map((opt, i) => (
                <TouchableOpacity key={i} style={styles.modalItem} onPress={() => selectOption(opt)}>
                  <Text style={styles.modalItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 15, textAlign: 'center' },
  subHeader: { fontSize: 16, color: '#666', marginTop: 20, marginBottom: 10, fontWeight:'bold' },

  chartContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  chartTitle: { fontSize: 14, fontWeight: '600', marginBottom: 20, color: '#444' },

  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  halfInput: { flex: 1 },
  
  input: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  label: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 5, fontWeight: '600' },
  value: { fontSize: 16, color: '#333', paddingVertical: 5 },
  textInput: { fontSize: 16, color: '#333', paddingVertical: 5, height: 40 },
  
  ocrButton: { backgroundColor: '#2563eb', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  ocrButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  sectionLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginTop: 10, marginBottom: 10 },
  qualityContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  qualityBtn: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  qualityOk: { backgroundColor: '#10b981' },
  qualityNotOk: { backgroundColor: '#ef4444' },
  qualityText: { fontWeight: 'bold', color: '#555' },
  textWhite: { color: '#fff' },

  submitBtn: { padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, elevation: 3 },
  btnBlue: { backgroundColor: '#2563eb' },
  btnRed: { backgroundColor: '#dc2626' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemText: { fontSize: 16 },
  closeBtn: { marginTop: 15, padding: 15, alignItems: 'center', backgroundColor: '#eee', borderRadius: 10 },
  closeText: { fontWeight: 'bold' }
});