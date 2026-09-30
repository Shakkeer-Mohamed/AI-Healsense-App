# HealSense Native Android: Premium Jetpack Compose Architecture

## 1. High-End UI Design Description

Inspired by Apple Health, Ada Health, and MyFitnessPal, the HealSense native Android app is designed with **Material Design 3 (Material You)**, implementing premium aesthetics:

*   **Color Palette:** Trust-inspiring clinical blues (`#1E3A8A`, `#3B82F6`) mixed with clean negative space (`#F8FAFC`, `#FFFFFF`), accented by vital status colors (Emerald for healthy, Amber for warning, Rose for alerts).
*   **Typography:** We use a modern sans-serif like **Inter** or **Outfit**. Large, confident headers and legible, high-contrast body text for accessibility.
*   **Glassmorphism & Cards:** Heavy use of elevated surfaces with subtle drop shadows (`elevation = 4.dp`, `elevation = 8.dp`), rounded corners (`RoundedCornerShape(24.dp)`), and semi-transparent overlays for modals to create depth.
*   **Micro-interactions:** 
    *   **Spring Animations:** Using `animateFloatAsState` with `spring` specs when cards are pressed.
    *   **Progressive Loading:** Shimmer effects for loading health data.
    *   **Transitions:** Smooth `AnimatedVisibility` and `SharedTransition` across screens.

---

## 2. Real Android Project Folder Structure (Clean Architecture)

```text
com.healsense.app
│
├── di/                     # Dependency Injection (Hilt)
│   ├── NetworkModule.kt
│   └── DatabaseModule.kt
│
├── data/                   # Data Layer
│   ├── local/              # Room Database, DataStore
│   ├── remote/             # Retrofit APIs
│   └── repository/         # Repository Implementations
│
├── domain/                 # Domain Layer
│   ├── model/              # Core Business Models (Patient, RiskScore)
│   ├── repository/         # Repository Interfaces
│   └── usecase/            # Use cases (e.g., GetPatientStatusUseCase)
│
└── presentation/           # UI Layer
    ├── theme/              # Compose Theme (Colors, Typography, Shapes)
    ├── components/         # Reusable Compose UI (GlassCard, CustomGauge)
    │
    ├── dashboard/          # Home Dashboard Feature
    │   ├── DashboardScreen.kt
    │   └── DashboardViewModel.kt
    │
    ├── checkin/            # Daily Check-in Feature
    │   ├── CheckInScreen.kt
    │   └── CheckInViewModel.kt
    │
    ├── assistant/          # AI Chat Feature
    │   ├── AssistantScreen.kt
    │   └── AssistantViewModel.kt
    │
    └── MainActivity.kt       # Single Activity Entry Point
```

---

## 3. Architecture Explanation (MVVM & Clean Architecture)

We employ **MVVM (Model-View-ViewModel)** heavily tied with **Clean Architecture** principles to ensure the app is scalable, testable, and production-ready:

1.  **Presentation Layer (UI & ViewModel):** 
    *   **Jetpack Compose** is the sole UI toolkit. Screens observe a `StateFlow` from the `ViewModel`.
    *   **ViewModel** handles presentation logic, transforming domain data into UI state (e.g., `DashboardUiState.Success`, `DashboardUiState.Loading`).
2.  **Domain Layer (Use Cases & Models):** 
    *   Houses the pure business logic (`CalculateRiskScoreUseCase`). This layer has zero knowledge of the Android framework or data sources.
3.  **Data Layer (Repositories):** 
    *   Implements the repository interfaces defined in the domain layer. It decides whether to fetch data from the local **Room Database** (for offline caching) or a remote **Retrofit network call** (Backend API).
4.  **Dependency Injection:** 
    *   **Dagger Hilt** wires these components together, ensuring repositories are injected as Singletons, and ViewModels are injected into Compose screens automatically.

---

## 4. Jetpack Compose Implementation (Core Screens)

*(Below are the core implementations for the Premium HealSense Android App)*

### Theme Setup (`theme/Theme.kt`)
```kotlin
package com.healsense.app.presentation.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

val PrimaryBlue = Color(0xFF2563EB)
val BackgroundLight = Color(0xFFF8FAFC)
val CardBackground = Color(0xFFFFFFFF)
val TextPrimary = Color(0xFF0F172A)
val SuccessGreen = Color(0xFF10B981)

val Shapes = Shapes(
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp)
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    background = BackgroundLight,
    surface = CardBackground,
    onPrimary = Color.White,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun HealSenseTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        shapes = Shapes,
        typography = Typography, // Custom typography defined elsewhere
        content = content
    )
}
```

### Dashboard Screen (`dashboard/DashboardScreen.kt`)
```kotlin
package com.healsense.app.presentation.dashboard

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun DashboardScreen() {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
            .padding(24.dp)
    ) {
        HeaderSection()
        Spacer(modifier = Modifier.height(32.dp))
        RecoveryRiskCard()
        Spacer(modifier = Modifier.height(24.dp))
        ActionGrid()
    }
}

@Composable
fun HeaderSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        justifyContent = SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                "Good Morning,",
                color = Color.Gray,
                fontSize = 16.sp
            )
            Text(
                "John Doe",
                fontWeight = FontWeight.Bold,
                fontSize = 28.sp,
                color = MaterialTheme.colorScheme.onBackground
            )
        }
        
        // Avatar with subtle shadow
        Box(
            modifier = Modifier
                .size(48.dp)
                .shadow(8.dp, CircleShape)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center
        ) {
            Text("JD", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun RecoveryRiskCard() {
    // Animation for the gauge value
    var targetScore by remember { mutableStateOf(0f) }
    val animatedScore by animateFloatAsState(
        targetValue = targetScore,
        animationSpec = tween(durationMillis = 1500, easing = FastOutSlowInEasing),
        label = "scoreAnimation"
    )

    LaunchedEffect(Unit) {
        delay(300)
        targetScore = 82f // Set from ViewModel in reality
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(16.dp, MaterialTheme.shapes.large, spotColor = Color(0x1A000000)),
        shape = MaterialTheme.shapes.large,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "Overall Recovery Risk",
                fontWeight = FontWeight.SemiBold,
                color = Color.Gray
            )
            Spacer(modifier = Modifier.height(16.dp))
            
            // Custom drawn Circular Gauge would go here (using Canvas)
            // Mocking the text for now
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(160.dp)
                    .background(
                        brush = Brush.radialGradient(
                            colors = listOf(Color(0xFFFFE4E6), Color.Transparent)
                        ),
                        shape = CircleShape
                    )
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        "${animatedScore.toInt()}",
                        fontSize = 56.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFBE123C) // High Risk Red
                    )
                    Text("High Risk", color = Color.Red, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun ActionGrid() {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        ActionCard(
            title = "Daily Check-In",
            icon = Icons.Rounded.CameraAlt,
            color = Color(0xFF3B82F6),
            modifier = Modifier.weight(1f)
        )
        ActionCard(
            title = "AI Assistant",
            icon = Icons.Rounded.ChatBubble,
            color = Color(0xFF10B981),
            modifier = Modifier.weight(1f)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActionCard(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color, modifier: Modifier = Modifier) {
    Card(
        onClick = { /* Navigate */ },
        modifier = modifier
            .height(140.dp)
            .shadow(8.dp, MaterialTheme.shapes.medium, spotColor = color.copy(alpha = 0.2f)),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.Start
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = title, tint = color)
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(title, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}
```

### Daily Check-In Screen (`checkin/CheckInScreen.kt`)
```kotlin
package com.healsense.app.presentation.checkin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Videocam
import androidx.compose.material.icons.rounded.MonitorHeart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun CheckInScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(24.dp)
    ) {
        Text("Today's Tasks", fontSize = 28.sp, fontWeight = FontWeight.Black)
        Spacer(modifier = Modifier.height(24.dp))
        
        TaskCard("Wound Image (CNN)", "Upload high-res photo", Icons.Rounded.CameraAlt, Color(0xFFF59E0B))
        Spacer(modifier = Modifier.height(16.dp))
        TaskCard("Walking Video (3D-CNN)", "10-second gait capture", Icons.Rounded.Videocam, Color(0xFF3B82F6))
        Spacer(modifier = Modifier.height(16.dp))
        TaskCard("Vocal Biomarker (LSTM)", "Record pain journal", Icons.Rounded.Mic, Color(0xFF8B5CF6))
    }
}

@Composable
fun TaskCard(title: String, subtitle: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(color.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = title, tint = color, modifier = Modifier.size(28.dp))
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF0F172A))
                Text(subtitle, color = Color(0xFF64748B), fontSize = 14.sp)
            }
        }
    }
}
```

### AI Health Assistant Screen (`assistant/AssistantScreen.kt`)
```kotlin
package com.healsense.app.presentation.assistant

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssistantScreen() {
    var textState by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        // Chat Window (Mocked)
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(24.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            AssistantBubble("Hello John. Based on your recent 3D-CNN gait analysis, I noticed a slight limp on your left side. Does your knee hurt more today?")
            Spacer(modifier = Modifier.height(16.dp))
            UserBubble("Yes, it's a bit stiff this morning.")
        }
        
        // Input Area
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = Color.White,
            shadowElevation = 16.dp
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = textState,
                    onValueChange = { textState = it },
                    modifier = Modifier.weight(1f),
                    placeholder = { Text("Ask your AI assistant...") },
                    shape = RoundedCornerShape(24.dp),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        unfocusedBorderColor = Color(0xFFE2E8F0),
                        focusedBorderColor = Color(0xFF3B82F6)
                    )
                )
                Spacer(modifier = Modifier.width(12.dp))
                IconButton(
                    onClick = { /* Send */ },
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(Color(0xFF3B82F6))
                ) {
                    Icon(Icons.Rounded.Send, contentDescription = "Send", tint = Color.White)
                }
            }
        }
    }
}

@Composable
fun AssistantBubble(text: String) {
    Row {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp))
                .background(Color.White)
                .padding(16.dp)
        ) {
            Text(text, color = Color(0xFF0F172A))
        }
        Spacer(modifier = Modifier.width(48.dp))
    }
}

@Composable
fun UserBubble(text: String) {
    Row(horizontalArrangement = Arrangement.End, modifier = Modifier.fillMaxWidth()) {
        Spacer(modifier = Modifier.width(48.dp))
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp, 16.dp, 4.dp, 16.dp))
                .background(Color(0xFF3B82F6))
                .padding(16.dp)
        ) {
            Text(text, color = Color.White)
        }
    }
}
```
