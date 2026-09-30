import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, Image
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { checkBackendHealth } from '@/services/api';

const screenWidth = Dimensions.get('window').width;
const HORIZONTAL_MARGIN = 16;
const CHART_WIDTH = screenWidth - (HORIZONTAL_MARGIN * 2) - 32;

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [refreshing, setRefreshing] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    const isOnline = await checkBackendHealth();
    setIsBackendConnected(isOnline);
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mock Data
  const riskScore = 82;
  const aiConfidence = 94;

  const recoveryData = {
    labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7'],
    datasets: [{ data: [45, 55, 65, 82], color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})` }]
  };

  const mobilityData = {
    labels: ['M', 'W', 'F'],
    datasets: [{ data: [80, 78, 60] }]
  };

  const getRiskColor = (score: number) => {
    if (score < 40) return colors.success;
    if (score < 75) return '#F59E0B'; // Amber
    return colors.danger; // Red
  };

  const riskColorHex = getRiskColor(riskScore);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkConnection().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: '#F8FAFC' }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBg}>
            <Ionicons name="medical" size={24} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>HealSense <Text style={styles.headerPro}>PRO</Text></Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SJ</Text>
        </View>
      </View>

      {/* Network / Connection Status Banner */}
      <View style={[
        styles.statusBanner,
        { backgroundColor: isBackendConnected ? '#ECFDF5' : '#FFFBEB', borderColor: isBackendConnected ? '#10B981' : '#F59E0B' }
      ]}>
        <Ionicons
          name={isBackendConnected ? "cloud-done" : "cloud-offline"}
          size={16}
          color={isBackendConnected ? "#10B981" : "#D97706"}
        />
        <Text style={[styles.statusText, { color: isBackendConnected ? "#065F46" : "#92400E" }]}>
          {isBackendConnected === null
            ? "Checking Backend..."
            : isBackendConnected
              ? "FastAPI Backend Connected (Live)"
              : "Offline / Standalone Mode (Local Mock Active)"}
        </Text>
      </View>

      {/* Top KPI Summary Bar (Scrollable horizontally) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll} contentContainerStyle={styles.kpiContainer}>
        <KpiCard title="Active Patients" value="124" icon="people" color="#3B82F6" />
        <KpiCard title="High Risk Today" value="3" icon="alert-circle" color="#EF4444" highlight />
        <KpiCard title="Avg Score" value="28.4" icon="stats-chart" color="#10B981" />
        <KpiCard title="Avg Days" value="14.2" icon="calendar" color="#6366F1" />
      </ScrollView>

      {/* Main Recovery Risk Panel */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Primary Recovery Risk</Text>

        <View style={styles.gaugeContainer}>
          <CircularGauge score={riskScore} color={riskColorHex} />

          <View style={styles.confidenceBadge}>
            <Ionicons name="hardware-chip" size={14} color="#3B82F6" />
            <Text style={styles.confidenceText}>AI Confidence: {aiConfidence}%</Text>
          </View>
        </View>

        <View style={styles.trendSection}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>7-Day Risk Trend</Text>
            <View style={styles.trendBadge}>
              <Ionicons name="trending-up" size={12} color="#EF4444" />
              <Text style={styles.trendBadgeText}>+10 Pts vs yesterday</Text>
            </View>
          </View>
          <LineChart
            data={recoveryData}
            width={CHART_WIDTH}
            height={160}
            withDots={true}
            withInnerLines={false}
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#EF4444' }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Multimodal AI Analysis Section */}
      <Text style={styles.sectionTitle}>Deep Learning Multimodal Analysis</Text>

      {/* Wound Analysis Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="camera" size={20} color="#EA580C" />
          </View>
          <Text style={styles.cardTitleText}>Wound Analysis (CNN)</Text>
        </View>

        <View style={styles.mediaPreviewContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop' }}
            style={styles.woundImage}
          />
          {/* Heatmap/Bounding Box Overlay */}
          <View style={styles.heatmapOverlay}>
            <View style={styles.boundingBox} />
          </View>
        </View>

        <ProgressBar label="Redness Score" value={65} color="#F97316" />
        <ProgressBar label="Swelling Index" value={42} color="#FBBF24" />

        <View style={styles.analysisFooter}>
          <Text style={styles.analysisFooterLabel}>Infection Probability</Text>
          <Text style={[styles.analysisFooterVal, { color: '#EF4444' }]}>38%</Text>
        </View>
        <Text style={styles.baselineText}><Ionicons name="arrow-up" size={10} color="#EF4444" /> +5% compared to baseline</Text>
      </View>

      {/* Gait Stability Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="body" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.cardTitleText}>Gait Stability (3D-CNN)</Text>
        </View>

        <View style={styles.mediaPreviewContainer}>
          <View style={[styles.woundImage, { backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="play-circle" size={48} color="#FFF" />
            {/* Skeleton Overlay Mock */}
            <View style={styles.skeletonLineVertical} />
            <View style={styles.skeletonLineHorizontal} />
          </View>
        </View>

        <ProgressBar label="Balance Score" value={54} color="#EF4444" />
        <ProgressBar label="Step Symmetry" value={60} color="#F59E0B" />

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 4 }}>Mobility Trend</Text>
          <LineChart
            data={mobilityData}
            width={CHART_WIDTH}
            height={80}
            withInnerLines={false}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            }}
            bezier
            style={{ paddingRight: 0, marginHorizontal: -16 }}
          />
        </View>
      </View>

      {/* Vocal Biomarker Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="mic" size={20} color="#6366F1" />
          </View>
          <Text style={styles.cardTitleText}>Vocal Biomarker (LSTM)</Text>
        </View>

        <View style={styles.waveformContainer}>
          <Ionicons name="play" size={20} color="#475569" style={{ marginRight: 8 }} />
          {/* Mock Waveform */}
          <View style={styles.waveformBars}>
            {[3, 7, 4, 9, 5, 8, 3, 2, 6, 4, 8, 5, 2].map((h, i) => (
              <View key={i} style={[styles.waveformBar, { height: h * 4 }]} />
            ))}
          </View>
        </View>

        <ProgressBar label="Pain Stress Index" value={82} color="#EF4444" />
        <ProgressBar label="Breathing Irreg." value={30} color="#10B981" />
        <ProgressBar label="Voice Fatigue" value={65} color="#F59E0B" />

        <View style={styles.analysisFooter}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>Confidence 91%</Text>
          </View>
        </View>
      </View>

      {/* Alert & Clinical Decision Panel */}
      <View style={[styles.card, styles.alertCard]}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertCardTitle}>Clinical Decision Support</Text>
          <View style={styles.alertLevelBadge}>
            <Text style={styles.alertLevelText}>High Priority</Text>
          </View>
        </View>

        <Text style={styles.alertExplanation}>
          <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Deviation Detected: </Text>
          Sharp decline in gait symmetry combined with elevated pain stress vocal markers. Image shows moderate redness.
        </Text>

        <View style={styles.suggestedActions}>
          <Text style={styles.suggestionTitle}>Suggested Actions</Text>
          <Text style={styles.suggestionItem}>• Review historical multimodal data</Text>
          <Text style={styles.suggestionItem}>• Call patient / Schedule visit</Text>
        </View>

        <View style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Acknowledge Alert</Text>
        </View>

        <View style={styles.humanLoop}>
          <Ionicons name="shield-checkmark" size={14} color="#94A3B8" />
          <Text style={styles.humanLoopText}>Human-in-the-loop active - Review Required</Text>
        </View>
      </View>

      {/* Patient Recovery Timeline */}
      <Text style={styles.sectionTitle}>Recovery Timeline</Text>
      <View style={[styles.card, { paddingBottom: 24 }]}>
        <TimelineItem date="Surgery Date" desc="Total Knee Arthroplasty" icon="calendar" color="#64748B" />
        <TimelineItem date="Oct 14" desc="Discharged from Hospital" icon="checkmark-circle" color="#10B981" />
        <TimelineItem date="Today" desc="Risk score spiked above threshold" icon="warning" color="#EF4444" isLast />
      </View>

      {/* Security & Compliance Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Ionicons name="lock-closed" size={16} color="#10B981" />
          <Text style={styles.footerText}>Encrypted HIPAA Compliant Data</Text>
        </View>
        <Text style={styles.footerDisclaimer}>
          This AI analysis is a clinical decision-support tool. It is not intended as a replacement for professional medical judgment or final diagnosis.
        </Text>
      </View>

    </ScrollView>
  );
}

// Subcomponents
function KpiCard({ title, value, icon, color, highlight }: any) {
  return (
    <View style={[styles.kpiCard, highlight && styles.kpiHighlight]}>
      <View style={styles.kpiTop}>
        <Text style={[styles.kpiTitle, highlight && { color: '#B91C1C' }]}>{title}</Text>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.kpiValue, highlight && { color: '#7F1D1D' }]}>{value}</Text>
    </View>
  );
}

function CircularGauge({ score, color }: { score: number, color: string }) {
  const size = 180;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View style={styles.gaugeWrapper}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.gaugeTextContainer}>
        <Text style={styles.gaugeScore}>{score}</Text>
        <Text style={styles.gaugeLabel}>Risk Score</Text>
      </View>
    </View>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressLabels}>
        <Text style={styles.progressLabelText}>{label}</Text>
        <Text style={styles.progressValText}>{value}/100</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function TimelineItem({ date, desc, icon, color, isLast }: any) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIconCol}>
        <View style={[styles.timelineIconBg, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineDate}>{date}</Text>
        <Text style={styles.timelineDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconBg: { backgroundColor: '#2563EB', padding: 6, borderRadius: 8, marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  headerPro: { color: '#2563EB', fontSize: 12, fontWeight: '700' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  avatarText: { color: '#1D4ED8', fontWeight: 'bold', fontSize: 12 },

  kpiScroll: { paddingVertical: 16, flexGrow: 0 },
  kpiContainer: { paddingHorizontal: 16, gap: 12 },
  kpiCard: { width: 140, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  kpiHighlight: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  kpiTitle: { fontSize: 12, fontWeight: '600', color: '#64748B', flex: 1, marginRight: 4 },
  kpiValue: { fontSize: 24, fontWeight: '900', color: '#0F172A' },

  card: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginLeft: 20, marginTop: 8, marginBottom: 12 },

  gaugeContainer: { alignItems: 'center', marginBottom: 20 },
  gaugeWrapper: { position: 'relative', width: 180, height: 180 },
  gaugeTextContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  gaugeScore: { fontSize: 56, fontWeight: '900', color: '#0F172A' },
  gaugeLabel: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  confidenceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  confidenceText: { fontSize: 12, fontWeight: '700', color: '#1E3A8A', marginLeft: 6 },

  trendSection: { marginTop: 8 },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  trendTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trendBadgeText: { fontSize: 10, fontWeight: '700', color: '#DC2626', marginLeft: 4 },
  chart: { marginHorizontal: -16, borderRadius: 16 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { padding: 8, borderRadius: 12, marginRight: 12 },
  cardTitleText: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },

  mediaPreviewContainer: { height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 16, position: 'relative' },
  woundImage: { width: '100%', height: '100%' },
  heatmapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  boundingBox: { position: 'absolute', top: 40, left: 60, width: 80, height: 80, borderWidth: 2, borderColor: '#EF4444', borderStyle: 'dashed', borderRadius: 8 },
  skeletonLineVertical: { position: 'absolute', width: 4, height: 100, backgroundColor: '#38BDF8', borderRadius: 2 },
  skeletonLineHorizontal: { position: 'absolute', width: 60, height: 4, backgroundColor: '#38BDF8', borderRadius: 2, top: 40 },

  progressRow: { marginBottom: 12 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabelText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  progressValText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  track: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },

  analysisFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  analysisFooterLabel: { fontSize: 13, fontWeight: '600', color: '#475569' },
  analysisFooterVal: { fontSize: 16, fontWeight: '800' },
  baselineText: { fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '500' },

  waveformContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  waveformBars: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 40, paddingHorizontal: 8 },
  waveformBar: { width: 4, backgroundColor: '#94A3B8', borderRadius: 2 },
  aiBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  aiBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  alertCard: { borderColor: '#FECACA', borderWidth: 2, backgroundColor: '#FFF' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alertCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  alertLevelBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  alertLevelText: { fontSize: 10, fontWeight: '800', color: '#B91C1C', textTransform: 'uppercase' },
  alertExplanation: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 16 },
  suggestedActions: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16 },
  suggestionTitle: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 6 },
  suggestionItem: { fontSize: 13, color: '#334155', fontWeight: '500', marginBottom: 4 },
  btnPrimary: { backgroundColor: '#0F172A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnPrimaryText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  humanLoop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  humanLoopText: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginLeft: 6 },

  timelineRow: { flexDirection: 'row', marginBottom: 0 },
  timelineIconCol: { alignItems: 'center', width: 40, marginRight: 12 },
  timelineIconBg: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  timelineContent: { flex: 1, paddingBottom: 24, paddingTop: 4 },
  timelineDate: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  timelineDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },

  footer: { padding: 24, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E2E8F0', marginTop: 16, marginBottom: 40 },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  footerText: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginLeft: 6 },
  footerDisclaimer: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16 },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
});

