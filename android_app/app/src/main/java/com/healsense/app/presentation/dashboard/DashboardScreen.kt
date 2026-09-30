package com.healsense.app.presentation.dashboard

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.healsense.app.presentation.theme.*

@Composable
fun DashboardScreen() {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SurfaceBackground)
            .verticalScroll(scrollState)
            .padding(16.dp)
            .padding(top = 32.dp)
    ) {
        HeaderSection()
        Spacer(modifier = Modifier.height(24.dp))
        
        KpiRow()
        Spacer(modifier = Modifier.height(24.dp))
        
        RecoveryRiskPanel()
        Spacer(modifier = Modifier.height(24.dp))
        
        SectionTitle("Multi-Modal AI Analysis")
        Spacer(modifier = Modifier.height(16.dp))
        
        WoundAnalysisCard()
        Spacer(modifier = Modifier.height(16.dp))
        
        GaitAnalysisCard()
        Spacer(modifier = Modifier.height(16.dp))
        
        VocalAnalysisCard()
        Spacer(modifier = Modifier.height(24.dp))
        
        ClinicalDecisionPanel()
        Spacer(modifier = Modifier.height(24.dp))
        
        SectionTitle("Recovery Timeline")
        Spacer(modifier = Modifier.height(16.dp))
        RecoveryTimeline()
        
        Spacer(modifier = Modifier.height(32.dp))
        SecurityFooter()
        Spacer(modifier = Modifier.height(48.dp))
    }
}

@Composable
fun HeaderSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(ClinicalBlueLight),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Rounded.MedicalServices, contentDescription = "Logo", tint = Color.White)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Text("HealSense", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Text("PRO", fontSize = 12.sp, fontWeight = FontWeight.Black, color = ClinicalBlueLight, modifier = Modifier.padding(start = 4.dp, top = 8.dp))
        }
        Icon(Icons.Rounded.NotificationsNone, contentDescription = "Alerts", tint = TextSecondary)
    }
}

@Composable
fun KpiRow() {
    // A horizontally scrolling row of KPIs
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        KpiCard(title = "Patients", value = "124", icon = Icons.Rounded.People, color = ClinicalBlueLight, modifier = Modifier.weight(1f))
        KpiCard(title = "Alerts", value = "3", icon = Icons.Rounded.Warning, color = AlertRed, modifier = Modifier.weight(1f))
        KpiCard(title = "Avg Score", value = "28.4", icon = Icons.Rounded.Analytics, color = SuccessGreen, modifier = Modifier.weight(1f))
    }
}

@Composable
fun KpiCard(title: String, value: String, icon: ImageVector, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier
            .shadow(4.dp, RoundedCornerShape(16.dp), spotColor = Color(0x0a000000)),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(12.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Black, color = TextPrimary)
            Text(title, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = TextTertiary)
        }
    }
}

@Composable
fun RecoveryRiskPanel() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(8.dp, RoundedCornerShape(24.dp), spotColor = Color(0x14000000)),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Primary Recovery Risk", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
            Spacer(modifier = Modifier.height(24.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Circular Gauge
                Box(contentAlignment = Alignment.Center, modifier = Modifier.size(140.dp)) {
                    Canvas(modifier = Modifier.size(120.dp)) {
                        drawArc(
                            color = DividerColor,
                            startAngle = 135f,
                            sweepAngle = 270f,
                            useCenter = false,
                            style = Stroke(width = 30f, cap = StrokeCap.Round)
                        )
                        drawArc(
                            color = AlertRed,
                            startAngle = 135f,
                            sweepAngle = 270f * 0.82f, // 82%
                            useCenter = false,
                            style = Stroke(width = 30f, cap = StrokeCap.Round)
                        )
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("82", fontSize = 42.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                        Text("High", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = AlertRed)
                    }
                }
                
                // Trend Line placeholder (Drawing a simple sparkline with Canvas)
                Column(modifier = Modifier.weight(1f).padding(start = 24.dp)) {
                    Text("7-Day Trend", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextTertiary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Canvas(modifier = Modifier.fillMaxWidth().height(60.dp)) {
                        val path = Path()
                        val width = size.width
                        val height = size.height
                        path.moveTo(0f, height * 0.8f)
                        path.lineTo(width * 0.2f, height * 0.7f)
                        path.lineTo(width * 0.4f, height * 0.9f)
                        path.lineTo(width * 0.6f, height * 0.6f)
                        path.lineTo(width * 0.8f, height * 0.4f)
                        path.lineTo(width, height * 0.1f) // Spike
                        drawPath(path = path, color = AlertRed, style = Stroke(width = 6f, cap = StrokeCap.Round))
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.background(AlertRedLight, RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Rounded.TrendingUp, contentDescription = null, tint = AlertRed, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("+10 Pts vs yesterday", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = AlertRed)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth().background(ClinicalBlueBackground, RoundedCornerShape(12.dp)).padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(Icons.Rounded.Memory, contentDescription = null, tint = ClinicalBlueLight, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("AI Confidence: 94%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = ClinicalBlueLight)
            }
        }
    }
}

@Composable
fun SectionTitle(title: String) {
    Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.padding(start = 8.dp))
}

@Composable
fun WoundAnalysisCard() {
    AnalysisCard(
        title = "Wound Image (CNN)",
        icon = Icons.Rounded.Healing,
        iconColor = WarningAmber
    ) {
        // Image preview placeholder
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color.LightGray)
        ) {
            // Mock Heatmap Overlay
            Box(modifier = Modifier.fillMaxSize().background(AlertRed.copy(alpha = 0.2f)))
        }
        Spacer(modifier = Modifier.height(16.dp))
        ProgressBarItem("Redness Score", 65, WarningAmber)
        Spacer(modifier = Modifier.height(12.dp))
        ProgressBarItem("Swelling Index", 42, WarningAmber)
        Spacer(modifier = Modifier.height(16.dp))
        Divider(color = DividerColor)
        Spacer(modifier = Modifier.height(12.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Infection Probability", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = TextSecondary)
            Text("38%", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = AlertRed)
        }
    }
}

@Composable
fun GaitAnalysisCard() {
    AnalysisCard(
        title = "Gait Stability (3D-CNN)",
        icon = Icons.Rounded.DirectionsWalk,
        iconColor = ClinicalBlueLight
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(TextPrimary),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Rounded.PlayCircleOutline, contentDescription = "Play", tint = Color.White, modifier = Modifier.size(48.dp))
        }
        Spacer(modifier = Modifier.height(16.dp))
        ProgressBarItem("Balance Score", 54, AlertRed)
        Spacer(modifier = Modifier.height(12.dp))
        ProgressBarItem("Step Symmetry", 60, WarningAmber)
    }
}

@Composable
fun VocalAnalysisCard() {
    AnalysisCard(
        title = "Vocal Biomarker (LSTM)",
        icon = Icons.Rounded.MicNone,
        iconColor = Color(0xFF8B5CF6) // Purple
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().background(SurfaceBackground, RoundedCornerShape(12.dp)).padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Rounded.PlayArrow, contentDescription = "Play", tint = TextSecondary)
            Spacer(modifier = Modifier.width(16.dp))
            // Mock Waveform
            Row(modifier = Modifier.weight(1f), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                listOf(3,7,4,9,5,8,3,2,6,4,8,5,2).forEach { height ->
                    Box(modifier = Modifier.width(3.dp).height((height * 4).dp).background(TextTertiary, CircleShape))
                }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ProgressBarItem("Pain Stress Index", 82, AlertRed)
        Spacer(modifier = Modifier.height(12.dp))
        ProgressBarItem("Breathing Irregularity", 30, SuccessGreen)
    }
}

@Composable
fun AnalysisCard(title: String, icon: ImageVector, iconColor: Color, content: @Composable () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().shadow(4.dp, RoundedCornerShape(20.dp), spotColor = Color(0x0a000000)),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier.size(36.dp).clip(RoundedCornerShape(10.dp)).background(iconColor.copy(alpha = 0.1f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(20.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
            }
            Spacer(modifier = Modifier.height(20.dp))
            content()
        }
    }
}

@Composable
fun ProgressBarItem(label: String, progress: Int, color: Color) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextSecondary)
            Text("$progress/100", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextTertiary)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Box(modifier = Modifier.fillMaxWidth().height(6.dp).background(SurfaceBackground, CircleShape)) {
            Box(modifier = Modifier.fillMaxWidth(progress / 100f).height(6.dp).background(color, CircleShape))
        }
    }
}

@Composable
fun ClinicalDecisionPanel() {
    Card(
        modifier = Modifier.fillMaxWidth().shadow(8.dp, RoundedCornerShape(20.dp), spotColor = AlertRed.copy(alpha = 0.2f)),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("Clinical Decision Support", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                Text("High Priority", fontSize = 10.sp, fontWeight = FontWeight.Black, color = AlertRed, modifier = Modifier.background(AlertRedLight, RoundedCornerShape(8.dp)).padding(horizontal = 8.dp, vertical = 4.dp))
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("Deviation Detected: Sharp decline in gait symmetry combined with elevated pain stress vocal markers.", fontSize = 13.sp, color = TextSecondary, lineHeight = 20.sp)
            Spacer(modifier = Modifier.height(16.dp))
            Column(modifier = Modifier.fillMaxWidth().background(SurfaceBackground, RoundedCornerShape(12.dp)).padding(16.dp)) {
                Text("SUGGESTED ACTIONS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextTertiary, letterSpacing = 1.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(6.dp).background(ClinicalBlueLight, CircleShape))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Review historical data", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(6.dp).background(ClinicalBlueLight, CircleShape))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Schedule immediate telehealth visit", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = TextPrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Acknowledge Alert", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun RecoveryTimeline() {
    Card(
        modifier = Modifier.fillMaxWidth().shadow(4.dp, RoundedCornerShape(20.dp), spotColor = Color(0x0a000000)),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            TimelineRow(date = "Oct 12", title = "Surgery Date", icon = Icons.Rounded.CalendarToday, color = TextTertiary, isLast = false)
            TimelineRow(date = "Oct 14", title = "Discharged", icon = Icons.Rounded.CheckCircleOutline, color = SuccessGreen, isLast = false)
            TimelineRow(date = "Today", title = "Risk Spike Detected", icon = Icons.Rounded.WarningAmber, color = AlertRed, isLast = true)
        }
    }
}

@Composable
fun TimelineRow(date: String, title: String, icon: ImageVector, color: Color, isLast: Boolean) {
    Row(modifier = Modifier.height(IntrinsicSize.Min)) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(40.dp)) {
            Box(modifier = Modifier.size(32.dp).background(color.copy(alpha = 0.1f), CircleShape), contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(16.dp))
            }
            if (!isLast) {
                Box(modifier = Modifier.width(2.dp).fillMaxHeight().background(SurfaceBackground).padding(vertical = 4.dp))
            }
        }
        Column(modifier = Modifier.padding(start = 12.dp, bottom = 24.dp)) {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
            Text(date, fontSize = 12.sp, color = TextTertiary, modifier = Modifier.padding(top = 2.dp))
        }
    }
}

@Composable
fun SecurityFooter() {
    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Rounded.Lock, contentDescription = "Secure", tint = SuccessGreen, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Encrypted HIPAA Compliant Data", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            "This AI analysis is a clinical decision-support tool. It is not intended as a replacement for professional medical judgment.",
            fontSize = 11.sp,
            color = TextTertiary,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            lineHeight = 16.sp,
            modifier = Modifier.padding(horizontal = 24.dp)
        )
    }
}
