import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './Config';

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  headerRow: { flexDirection: 'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textMain },

  fab: {
    position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 4 },
    zIndex: 999
  },
  fabText: { fontSize: 32, color: 'white', lineHeight: 34 },

  filterContainer: { marginBottom: 15 },
  filterChip: { backgroundColor: COLORS.white, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 25, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  activeChipOk: { backgroundColor: COLORS.greenLight, borderColor: COLORS.greenDark },
  activeChipNotOk: { backgroundColor: COLORS.redLight, borderColor: COLORS.redDark },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSub },

  chartContainer: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  chartTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMain },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: 8, padding: 3 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  activeToggle: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  toggleText: { fontSize: 10, fontWeight: '600', color: COLORS.textSub },
  activeToggleText: { color: COLORS.textMain },

  metricToggleRow: { flexDirection: 'row', gap: 10, marginBottom: 10, justifyContent: 'center' },
  metricBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  activeMetricBtn: { backgroundColor: COLORS.activeToggle, borderColor: COLORS.primary },
  metricText: { fontSize: 11, fontWeight: '600', color: COLORS.textSub },
  activeMetricText: { color: COLORS.activeToggleText },

  subHeader: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 15 },
  logCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'transparent', elevation: 2 },
  cardOk: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  cardNotOk: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  lineBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  logGroup: { fontSize: 12, fontWeight: '600', color: COLORS.textSub },
  dateText: { fontSize: 10, fontWeight: '600', color: COLORS.textSub, opacity: 0.7 },
  
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginBottom: 12 },
  
  logBody: { flexDirection: 'row', justifyContent: 'space-between' },
  statCol: { flex: 1 },
  statLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textSub, marginBottom: 2, textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '700', color: COLORS.textMain },
  statusText: { fontSize: 12, fontWeight: '800' },

  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  pageBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  pageBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textSub },

  inputModalContainer: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { flexDirection:'row', justifyContent:'space-between', padding: 20, backgroundColor: COLORS.white, borderBottomWidth:1, borderBottomColor: COLORS.border },
  modalHeaderTitle: { fontSize: 18, fontWeight: '800' },
  closeModalIcon: { padding: 5 },

  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 30 },
  row: { flexDirection: 'row', gap: 15 },
  halfInput: { flex: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  
  input: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 5 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textSub, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontSize: 15, color: COLORS.textMain, paddingVertical: 4 },
  textInput: { fontSize: 16, color: COLORS.textMain, paddingVertical: 4, height: 40 },
  
  ocrButton: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  ocrButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 11 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSub, textTransform: 'uppercase', marginTop: 10, marginBottom: 10 },
  qualityContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  qualityBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qualityInactive: { backgroundColor: COLORS.bg },
  qualityOk: { backgroundColor: COLORS.greenDark },
  qualityNotOk: { backgroundColor: COLORS.redDark },
  qualityText: { fontWeight: '700', fontSize: 14 },
  textGray: { color: COLORS.textSub },
  textWhite: { color: COLORS.white },

  submitBtn: { padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  btnBlue: { backgroundColor: COLORS.primary },
  btnRed: { backgroundColor: COLORS.redDark },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, elevation: 10, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: COLORS.textMain },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.bg },
  modalItemText: { fontSize: 15, fontWeight: '500', color: COLORS.textMain },
  closeBtn: { marginTop: 20, padding: 14, alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: 12 },
  closeText: { fontWeight: '700', color: COLORS.textSub }
});
