// API Configuration for HealSense
// - Primary Wi-Fi LAN IP for Physical Phone: http://192.168.137.246:8000
// - Localhost loopback: http://127.0.0.1:8000

let API_BASE_URL = 'http://192.168.137.246:8000';

export const getApiBaseUrl = () => API_BASE_URL;

export const setApiBaseUrl = (url: string) => {
    API_BASE_URL = url.replace(/\/$/, '');
};

// Helper for fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 4000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

/**
 * Check if the FastAPI backend is currently online and reachable
 */
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/`, { method: 'GET' }, 2500);
        return res.ok;
    } catch {
        return false;
    }
};

/**
 * Fetch patient information by ID with mock fallback
 */
export const fetchPatient = async (patientId: number) => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/patients/${patientId}`);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`[HealSense API] Backend unavailable (${error}). Using fallback patient data.`);
        return {
            id: patientId,
            name: "John Doe",
            email: "john@example.com",
            surgery_type: "Knee Replacement",
            surgery_date: "2023-10-01",
            risk_score: 82,
            is_mock: true
        };
    }
};

/**
 * Fetch active alerts with mock fallback
 */
export const fetchAlerts = async () => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/alerts`);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`[HealSense API] Backend unavailable (${error}). Using fallback alerts data.`);
        return [
            {
                id: 1,
                patient_id: 1,
                message: "Elevated infection risk detected from wound image.",
                severity: "HIGH",
                timestamp: new Date().toISOString(),
                is_mock: true
            }
        ];
    }
};

/**
 * Upload image, video, or audio for AI analysis with mock fallback
 */
export const uploadMedia = async (patientId: number, uri: string, type: 'image' | 'video' | 'audio') => {
    try {
        const formData = new FormData();
        const filename = uri.split('/').pop() || `upload.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'm4a'}`;

        let mimeType = 'application/octet-stream';
        if (type === 'image') mimeType = 'image/jpeg';
        else if (type === 'video') mimeType = 'video/mp4';
        else if (type === 'audio') mimeType = 'audio/m4a';

        formData.append('file', {
            uri: uri,
            name: filename,
            type: mimeType,
        } as any);

        const uploadUrl = `${API_BASE_URL}/upload/${type}?patient_id=${patientId}`;

        const response = await fetchWithTimeout(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }, 8000);

        if (!response.ok) throw new Error(`Upload HTTP status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`[HealSense API] Upload to backend failed (${error}). Operating in mock evaluation mode.`);
        const mockScore = Math.floor(Math.random() * 30) + 70; // 70 - 99 score
        return {
            filename: uri.split('/').pop() || "local_file",
            file_type: type,
            analysis_score: mockScore,
            message: `Processed locally (Mock AI mode). Risk score: ${mockScore}`,
            is_mock: true
        };
    }
};

