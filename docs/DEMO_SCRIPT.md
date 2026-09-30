# HealSense Demo Script (3-5 Minutes)

**[Introduction - 30 seconds]**
"Hi everyone, we are team [Name]. We're addressing a critical gap in post-operative care: the lack of continuous, objective monitoring once a patient goes home. We built HealSense, a remote recovery monitoring platform."

**[Mobile App Demo - 1 minute]**
*Show the React Native mobile app compiling/running on simulator.*
"Here is our patient app. I am a patient recovering from knee surgery. Every day, I get a notification to provide a quick update."
1. "First, I can upload a photo of my wound. Our simulated CNN model will assess it for redness and swelling."
2. "Next, I upload a short video of me walking down the hall. We use pose estimation to grade my mobility symmetry."
3. "Finally, I record a 10-second voice update saying how I feel. Our speech pipeline extracts markers of pain and distress."

*Click 'Submit' on the app. Show uploading progress UI.*

**[Backend Processing - 30 seconds]**
*Show FastAPI backend console logs with mock processing.*
"Our FastAPI backend receives these multi-modal inputs and runs them through our AI scoring matrix. It combines the wound image score, mobility symmetry score, and vocal pain indicators into a single Risk Score."

**[Doctor Dashboard Demo - 1 minute]**
*Switch screens to the React web app.*
"Now let's switch to the doctor's perspective. Here is the doctor dashboard. We see a summarized list of all our patients."
1. "Notice my patient profile has popped up with an 'Elevated Risk' alert, highlighted in red."
2. "Our multimodal engine assigned a score of 82/100, largely because the gait symmetry is low and the pain markers in my voice are elevated."
3. "The doctor can click into the profile to view the exact video, image, and voice clip I just uploaded."

**[Conclusion - 30 seconds]**
"With HealSense, doctors receive actionable, early warnings, allowing them to intervene before minor complications become major emergencies. HealSense: Data-driven recovery, from home."
