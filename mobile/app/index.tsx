import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { BarChart, LineChart } from 'react-native-gifted-charts';

import { COLORS, STANDARDS, API_URL } from '../constants/Config';
import { OperationalData, MasterData } from '../constants/Types';
import { styles } from '../constants/Styles';

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [chartType, setChartType] = useState('area'); 
  const [chartMetric, setChartMetric] = useState('suhu'); 
  
  const [master, setMaster] = useState<MasterData>({ groups: [], shifts: [], lines: [] });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [allData, setAllData] = useState<OperationalData[]>([]); 
  const [chartData, setChartData] = useState<any[]>([]); 

  const [filterLine, setFilterLine] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [form, setForm] = useState({
    group: '', shift: '', line: '', suhu: '', berat: '', kualitas: 'OK'
  });

  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  
  const [pickerType, setPickerType] = useState(''); 
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);

  const [tablePage, setTablePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    processChartData();
  }, [allData, filterLine, filterStatus, chartMetric]);

  useEffect(() => {
    if (form.suhu && form.berat) {
        const temp = parseInt(form.suhu);
        const weight = parseFloat(form.berat);
        
        const isBadTemp = temp < STANDARDS.minSuhu || temp > STANDARDS.maxSuhu;
        const isBadWeight = weight < STANDARDS.minBerat || weight > STANDARDS.maxBerat;

        if (isBadTemp || isBadWeight) {
            setForm(prev => ({ ...prev, kualitas: 'NOT OK' }));
        } else {
            setForm(prev => ({ ...prev, kualitas: 'OK' }));
        }
    }
  }, [form.suhu, form.berat]);

  const fetchAllData = async () => {
    try {
      const resMaster = await fetch(`${API_URL}/master`);
      const dataMaster = await resMaster.json();
      setMaster(dataMaster);

      const resData = await fetch(`${API_URL}/data`);
      const dataLogs = await resData.json();
      setAllData(dataLogs);
    } catch (err) {
      console.log("Error fetch:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  const processChartData = () => {
    let filtered = allData;
    if (filterLine) filtered = filtered.filter(item => item.line === filterLine);
    if (filterStatus) filtered = filtered.filter(item => item.kualitas === filterStatus);

    const recentData = filtered.slice(-10); 

    if (recentData.length > 0) {
      const formattedData = recentData.map(item => {
        const val = chartMetric === 'suhu' ? Number(item.suhu) : Number(item.berat);
        return {
            value: val,
            label: item.line,
            dataPointText: val.toString(),
            frontColor: item.kualitas === 'OK' ? COLORS.greenDark : COLORS.redDark,
            dataPointColor: item.kualitas === 'OK' ? COLORS.greenDark : COLORS.redDark,
            topLabelComponent: () => (
                <Text style={{color: COLORS.textSub, fontSize: 10, marginBottom: 4, fontWeight: 'bold'}}>{val}</Text>
            )
        };
      });
      setChartData(formattedData);
    } else {
      setChartData([]);
    }
  };

  const getPaginatedTableData = () => {
    let filtered = allData;
    if (filterLine) filtered = filtered.filter(item => item.line === filterLine);
    if (filterStatus) filtered = filtered.filter(item => item.kualitas === filterStatus);
    
    const sorted = [...filtered].reverse();
    const startIndex = (tablePage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleOCR = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) { Alert.alert("Izin", "Akses kamera ditolak."); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6, base64: true });

    if (!result.canceled) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('base64Image', `data:image/jpeg;base64,${result.assets[0].base64}`);
        formData.append('language', 'eng');
        formData.append('scale', 'true'); 
        formData.append('OCREngine', '2'); 
        
        const API_KEY = 'K81502281388957'; 
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST', headers: { 'apikey': API_KEY }, body: formData
        });

        const data = await response.json();
        const text = data.ParsedResults?.[0]?.ParsedText;
        const match = text?.match(/[0-9]+([.,][0-9]+)?/);

        if (match) {
            const num = match[0].replace(',', '.');
            setForm(prev => ({ ...prev, berat: num }));
            Alert.alert("OCR Sukses", `Angka: ${num}`);
        } else { Alert.alert("Gagal", "Tidak ada angka."); }
      } catch (error) { Alert.alert("Error", "Gagal koneksi OCR."); } 
      finally { setLoading(false); }
    }
  };

  const handlePreSubmit = () => {
    if (!form.group || !form.shift || !form.line || !form.suhu || !form.berat) {
      Alert.alert("Validasi", "Harap isi semua kolom!"); return;
    }
    setConfirmVisible(true);
  };

  const handleFinalSubmit = async () => {
    setConfirmVisible(false);
    setLoading(true);
    try {
      await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            ...form, 
            suhu: parseInt(form.suhu), 
            berat: parseFloat(form.berat),
            date: new Date().toISOString()
        })
      });
      Alert.alert("Sukses", "Data tersimpan!");
      setForm(prev => ({ ...prev, suhu: '', berat: '' })); 
      fetchAllData();
      setInputModalVisible(false); 
    } catch (err) { Alert.alert("Gagal", "Error kirim data."); } 
    finally { setLoading(false); }
  };

  const openPicker = (type: string) => {
    setPickerType(type);
    if (type === 'group') setPickerOptions(master.groups);
    if (type === 'shift') setPickerOptions(master.shifts.map(String));
    if (type === 'line') setPickerOptions(master.lines);
    if (type === 'filterLine') setPickerOptions(['All Lines', ...master.lines]);
    setPickerModalVisible(true);
  };

  const selectOption = (item: string) => {
    setPickerModalVisible(false);
    if (pickerType === 'filterLine') {
        setFilterLine(item === 'All Lines' ? '' : item);
        return;
    }
    setForm({ ...form, [pickerType as keyof typeof form]: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Production Dashboard</Text>
        </View>

        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
                <TouchableOpacity style={styles.filterChip} onPress={() => openPicker('filterLine')}>
                    <Text style={styles.filterText}>{filterLine ? `Line ${filterLine}` : 'All Lines'} ▾</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterChip, filterStatus === 'OK' && styles.activeChipOk]} 
                    onPress={() => setFilterStatus(filterStatus === 'OK' ? '' : 'OK')}
                >
                    <Text style={[styles.filterText, filterStatus === 'OK' && {color: COLORS.greenDark}]}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterChip, filterStatus === 'NOT OK' && styles.activeChipNotOk]} 
                    onPress={() => setFilterStatus(filterStatus === 'NOT OK' ? '' : 'NOT OK')}
                >
                    <Text style={[styles.filterText, filterStatus === 'NOT OK' && {color: COLORS.redDark}]}>Reject</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>

        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Grafik Produksi</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity onPress={() => setChartType('area')} style={[styles.toggleBtn, chartType === 'area' && styles.activeToggle]}>
                        <Text style={[styles.toggleText, chartType === 'area' && styles.activeToggleText]}>Area</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setChartType('bar')} style={[styles.toggleBtn, chartType === 'bar' && styles.activeToggle]}>
                        <Text style={[styles.toggleText, chartType === 'bar' && styles.activeToggleText]}>Bar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.metricToggleRow}>
                <TouchableOpacity 
                    onPress={() => setChartMetric('suhu')} 
                    style={[styles.metricBtn, chartMetric === 'suhu' && styles.activeMetricBtn]}
                >
                    <Text style={[styles.metricText, chartMetric === 'suhu' && styles.activeMetricText]}>Suhu (°C)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => setChartMetric('berat')} 
                    style={[styles.metricBtn, chartMetric === 'berat' && styles.activeMetricBtn]}
                >
                    <Text style={[styles.metricText, chartMetric === 'berat' && styles.activeMetricText]}>Berat (kg)</Text>
                </TouchableOpacity>
            </View>

            {chartData.length > 0 ? (
                <View style={{ alignItems: 'center', width: '100%', overflow: 'hidden', marginTop: 10 }}>
                    {chartType === 'bar' ? (
                        <BarChart
                            key={`bar-${chartMetric}-${chartType}-${JSON.stringify(chartData)}`}
                            data={chartData}
                            barWidth={22}
                            noOfSections={4}
                            barBorderRadius={4}
                            frontColor={COLORS.primary}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            yAxisTextStyle={{color: COLORS.textSub, fontSize: 10}}
                            xAxisLabelTextStyle={{color: COLORS.textSub, fontSize: 10}}
                            width={screenWidth - 80}
                            height={180}
                            spacing={20}
                            maxValue={Math.max(...chartData.map(d => d.value)) * 1.25 || 10} 
                            isAnimated
                        />
                    ) : (
                        <LineChart
                            key={`line-${chartMetric}-${chartType}-${JSON.stringify(chartData)}`}
                            areaChart
                            data={chartData}
                            startFillColor="rgba(37, 99, 235, 0.3)"
                            startOpacity={0.8}
                            endFillColor="rgba(37, 99, 235, 0.01)"
                            endOpacity={0.1}
                            color={COLORS.primary}
                            thickness={2}
                            dataPointsColor={COLORS.primary}
                            width={screenWidth - 80}
                            height={180}
                            spacing={35}
                            noOfSections={4}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            yAxisTextStyle={{color: COLORS.textSub, fontSize: 10}}
                            xAxisLabelTextStyle={{color: COLORS.textSub, fontSize: 10}}
                            maxValue={Math.max(...chartData.map(d => d.value)) * 1.25 || 10}
                            isAnimated
                            curved
                        />
                    )}
                </View>
            ) : (
                <Text style={{textAlign:'center', color:'#999', marginVertical: 20}}>Belum ada data</Text>
            )}
        </View>

        <Text style={styles.subHeader}>Recent Logs</Text>
        <View style={{marginBottom: 80}}>
            {getPaginatedTableData().map((item, index) => {
                const isOk = item.kualitas === 'OK';
                return (
                    <View key={index} style={[
                        styles.logCard, 
                        isOk ? styles.cardOk : styles.cardNotOk
                    ]}>
                        <View style={styles.logHeader}>
                            <View style={{flexDirection:'row', alignItems:'center', gap: 8}}>
                                <View style={[styles.lineBadge, isOk ? {backgroundColor: COLORS.greenDark} : {backgroundColor: COLORS.redDark}]}>
                                    <Text style={{color:'white', fontWeight:'bold', fontSize:12}}>{item.line}</Text>
                                </View>
                                <Text style={styles.logGroup}>{item.group}</Text>
                            </View>
                            <Text style={styles.dateText}>
                                {item.date ? new Date(item.date).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit'}) : '-'}
                            </Text>
                        </View>
                        
                        <View style={styles.divider} />

                        <View style={styles.logBody}>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>SUHU</Text>
                                <Text style={styles.statValue}>{item.suhu}°C</Text>
                            </View>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>BERAT</Text>
                                <Text style={styles.statValue}>{item.berat} kg</Text>
                            </View>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>SHIFT</Text>
                                <Text style={styles.statValue}>{item.shift}</Text>
                            </View>
                            <View style={[styles.statCol, {alignItems:'flex-end'}]}>
                                <Text style={[styles.statusText, isOk ? {color: COLORS.greenDark} : {color: COLORS.redDark}]}>
                                    {isOk ? "OK" : "REJECT"}
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            })}
            
            <View style={styles.pagination}>
                <TouchableOpacity onPress={() => setTablePage(p => Math.max(1, p - 1))} disabled={tablePage === 1} style={styles.pageBtn}>
                    <Text style={styles.pageBtnText}>Prev</Text>
                </TouchableOpacity>
                <Text style={{fontWeight:'600', color: COLORS.textSub}}>Page {tablePage}</Text>
                <TouchableOpacity onPress={() => setTablePage(p => p + 1)} disabled={getPaginatedTableData().length < itemsPerPage} style={styles.pageBtn}>
                    <Text style={styles.pageBtnText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => setInputModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={inputModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.inputModalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Input Data Baru</Text>
                <TouchableOpacity onPress={() => setInputModalVisible(false)} style={styles.closeModalIcon}>
                    <Text style={{fontSize: 20, color: COLORS.textSub}}>✕</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={{padding: 20}}>
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
                        <Text style={styles.value}>{form.line || "Pilih Line..."}</Text>
                    </TouchableOpacity>

                    <View style={styles.input}>
                        <Text style={styles.label}>Suhu (°C)</Text>
                        <TextInput style={styles.textInput} placeholder="0" keyboardType="number-pad"
                        value={form.suhu} onChangeText={(t) => setForm({...form, suhu: t})} />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.label}>Berat (kg) - OCR</Text>
                        <View style={styles.rowCenter}>
                        <TextInput style={[styles.textInput, { flex: 1, backgroundColor: '#f8fafc', color: '#333' }]}
                            placeholder="Scan via OCR..." editable={false} value={form.berat.toString()} />
                        <TouchableOpacity style={styles.ocrButton} onPress={handleOCR}>
                            <Text style={styles.ocrButtonText}>📷 SCAN</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>QC Recommendation (Auto / Manual)</Text>
                    <View style={styles.qualityContainer}>
                        <TouchableOpacity 
                            onPress={() => setForm({...form, kualitas: 'OK'})}
                            style={[styles.qualityBtn, form.kualitas === 'OK' ? styles.qualityOk : styles.qualityInactive]}
                        >
                            <Text style={[styles.qualityText, form.kualitas === 'OK' ? styles.textWhite : styles.textGray]}>OK</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={() => setForm({...form, kualitas: 'NOT OK'})}
                            style={[styles.qualityBtn, form.kualitas === 'NOT OK' ? styles.qualityNotOk : styles.qualityInactive]}
                        >
                            <Text style={[styles.qualityText, form.kualitas === 'NOT OK' ? styles.textWhite : styles.textGray]}>NOT OK</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.submitBtn, form.kualitas === 'NOT OK' ? styles.btnRed : styles.btnBlue]} 
                        onPress={handlePreSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : (
                        <Text style={styles.submitText}>{form.kualitas === 'NOT OK' ? 'SUBMIT REJECT' : 'SUBMIT DATA'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
      </Modal>

      <Modal visible={pickerModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{pickerType === 'filterLine' ? 'Filter Line' : `Pilih ${pickerType}`}</Text>
            <ScrollView>
              {pickerOptions.map((opt, i) => (
                <TouchableOpacity key={i} style={styles.modalItem} onPress={() => selectOption(opt)}>
                  <Text style={styles.modalItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setPickerModalVisible(false)}>
              <Text style={styles.closeText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, {color: form.kualitas === 'OK' ? COLORS.greenDark : COLORS.redDark}]}>
                Konfirmasi {form.kualitas}
            </Text>
            <View style={{marginVertical: 10, backgroundColor: COLORS.bg, padding:15, borderRadius:10}}>
                <Text style={{fontWeight:'bold', fontSize:16, marginBottom:5}}>Line {form.line}</Text>
                <Text style={{color: COLORS.textSub}}>Group: {form.group} / Shift {form.shift}</Text>
                <View style={{height:1, backgroundColor:'#ddd', marginVertical:8}}/>
                <Text style={{fontSize:14}}>Suhu: <Text style={{fontWeight:'bold'}}>{form.suhu}°C</Text></Text>
                <Text style={{fontSize:14}}>Berat: <Text style={{fontWeight:'bold'}}>{form.berat} kg</Text></Text>
            </View>
            <View style={{flexDirection:'row', gap:10, marginTop:10}}>
                <TouchableOpacity style={[styles.closeBtn, {flex:1, marginTop:0}]} onPress={() => setConfirmVisible(false)}>
                    <Text style={styles.closeText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.closeBtn, {flex:1, marginTop:0, backgroundColor: COLORS.primary}]} onPress={handleFinalSubmit}>
                    <Text style={[styles.closeText, {color:'white'}]}>Ya, Kirim</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
