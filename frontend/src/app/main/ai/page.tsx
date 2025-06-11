"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload, IconX, IconCat, IconPaw, IconArrowRight, IconDownload, IconMars, IconVenus } from "@tabler/icons-react";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { QuestionWrapper } from "@/components/ui/question-wrapper";
import { cn } from "@/lib/utils";
import Image from "next/image";

type DetectionMode = "image" | "questionnaire" | null;
type Step = "info" | "method" | "detection";

interface CatInfo {
  name: string;
  age: string;
  gender: "male" | "female" | "";
  weight?: number;
  body_temperature?: number;
  duration_days?: number;
  heart_rate?: number;
}

interface Question {
  id: string;
  text: string;
}

interface PredictionResponse {
  success: boolean;
  data: {
    predicted_disease: string;
    confidence: number;
    diagnosis: string;
    recommendations: string;
    accuracy: string;
    cat_info: any;
    active_symptoms: string[];
    all_probabilities: Record<string, number>;
  };
}

const questions: Question[] = [
  {
    id: "cough",
    text: "Apakah kucing Anda mengalami batuk?"
  },
  {
    id: "coughDuration",
    text: "Apakah batuk berlangsung lebih dari 3 minggu?"
  },
  {
    id: "phlegmGreen",
    text: "Apakah dahak yang keluar kental dan berwarna hijau?"
  },
  {
    id: "phlegmBlood",
    text: "Apakah dahak yang keluar berwarna merah atau bercampur darah?"
  },
  {
    id: "breathingDifficulty",
    text: "Apakah kucing Anda terlihat kesulitan bernapas?"
  },
  {
    id: "fever",
    text: "Apakah kucing Anda mengalami demam?"
  },
  {
    id: "nightSweats",
    text: "Apakah kucing Anda sering berkeringat di malam hari?"
  },
  {
    id: "discomfort",
    text: "Apakah kucing Anda terlihat tidak nyaman?"
  },
  {
    id: "appetiteLoss",
    text: "Apakah nafsu makan kucing Anda berkurang?"
  },
  {
    id: "weightLoss",
    text: "Apakah berat badan kucing Anda menurun?"
  },
  {
    id: "yellowPhlegm",
    text: "Apakah dahak yang keluar agak cair dan berwarna kuning seperti nanah?"
  },
  {
    id: "breathingSound",
    text: "Apakah napas kucing Anda berbunyi seperti siulan atau desahan tinggi?"
  },
  {
    id: "vomiting",
    text: "Apakah kucing Anda mengalami muntah?"
  },
  {
    id: "diarrhea",
    text: "Apakah kucing Anda mengalami diare?"
  }
];

const loadingStates = [
  { text: "Menganalisis gejala..." },
  { text: "Memeriksa database penyakit..." },
  { text: "Mencocokkan dengan kasus serupa..." },
  { text: "Menghasilkan diagnosis..." },
  { text: "Menyiapkan rekomendasi..." }
];

export default function AIPage() {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [catInfo, setCatInfo] = useState<CatInfo>({
    name: "",
    age: "",
    gender: "",
    weight: 4.0,
    body_temperature: 38.5,
    duration_days: 3,
    heart_rate: 120
  });
  const [detectionMode, setDetectionMode] = useState<DetectionMode>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCatInfoSubmit = () => {
    if (catInfo.name && catInfo.age && catInfo.gender) {
      setCurrentStep("method");
    }
  };

  const handleMethodSelect = (mode: DetectionMode) => {
    setDetectionMode(mode);
    setCurrentStep("detection");
    if (mode === "questionnaire") {
      // Initialize all answers as null
      const initialAnswers: Record<string, boolean | null> = {};
      questions.forEach(q => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) return;
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // For now, call the placeholder image detection endpoint
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/ai/detect-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_url: selectedImage,
          cat_info: catInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      
      // Set placeholder result until computer vision is implemented
      setPredictionResult({
        predicted_disease: "Pemeriksaan Visual",
        confidence: 85,
        diagnosis: result.data.diagnosis,
        recommendations: result.data.recommendations,
        accuracy: result.data.accuracy,
        cat_info: catInfo,
        active_symptoms: ["Pemeriksaan visual"],
        all_probabilities: { "Sehat": 85, "Perlu Perhatian": 15 }
      });
      
      setShowResult(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuestionnaireSubmit = async () => {
    const allAnswered = Object.values(answers).every(answer => answer !== null);
    if (!allAnswered) {
      alert("Mohon jawab semua pertanyaan terlebih dahulu");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to use AI features');
      }

      // Prepare request data
      const requestData = {
        cat_info: {
          name: catInfo.name,
          age: catInfo.age,
          gender: catInfo.gender,
          weight: catInfo.weight || 4.0,
          body_temperature: catInfo.body_temperature || 38.5,
          duration_days: catInfo.duration_days || 3,
          heart_rate: catInfo.heart_rate || 120
        },
        questionnaire: answers
      };

      console.log('Sending prediction request:', requestData);

      // Call AI prediction API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/ai/predict-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: PredictionResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.data?.toString() || 'Prediction failed');
      }

      console.log('Prediction result:', result);
      
      setPredictionResult(result.data);
      setShowResult(true);

    } catch (error) {
      console.error('Error in questionnaire submission:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('login')) {
          setError('Silakan login terlebih dahulu untuk menggunakan fitur AI.');
        } else if (error.message.includes('unavailable')) {
          setError('Layanan AI sedang tidak tersedia. Silakan coba lagi nanti.');
        } else {
          setError(`Terjadi kesalahan: ${error.message}`);
        }
      } else {
        setError('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    if (!predictionResult) return;

    const printContent = `
      Data Kucing:
      Nama: ${catInfo.name}
      Usia: ${catInfo.age}
      Jenis Kelamin: ${catInfo.gender === 'male' ? 'Jantan' : 'Betina'}

      Hasil Diagnosis:
      Penyakit: ${predictionResult.predicted_disease}
      Tingkat Keyakinan: ${predictionResult.confidence}%
      
      Detail Diagnosis:
      ${predictionResult.diagnosis.replace(/<[^>]*>/g, '')}

      Rekomendasi Penanganan:
      ${predictionResult.recommendations.replace(/<[^>]*>/g, '')}

      Gejala yang Terdeteksi:
      ${predictionResult.active_symptoms.join(', ')}

      Catatan Penting:
      Hasil diagnosa ini memiliki tingkat akurasi ${predictionResult.accuracy}% berdasarkan penelitian, yang berarti tidak 100% akurat. 
      Layanan ini bersifat edukatif, bukan solutif, dan tidak menggantikan konsultasi medis profesional.
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Hasil Diagnosa PurrPal AI</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1 { color: #FF823C; }
        .section { margin-bottom: 20px; }
        .header { border-bottom: 2px solid #FF823C; padding-bottom: 10px; margin-bottom: 20px; }
        .warning { color: #EF4444; }
        .diagnosis { margin: 20px 0; }
        .recommendations { margin: 20px 0; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="header"><h1>Hasil Diagnosa PurrPal AI</h1></div>');
      printWindow.document.write(printContent.split('\n').map(line => `<p>${line}</p>`).join(''));
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderCatInfoForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FF823C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <IconCat className="w-10 h-10 text-[#FF823C]" />
          </div>
          <h3 className="text-3xl font-semibold mb-4">Informasi Kucing</h3>
          <p className="text-gray-600 text-lg">
            Lengkapi informasi kucing Anda untuk hasil yang lebih akurat
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Nama Kucing *
            </label>
            <input
              type="text"
              value={catInfo.name}
              onChange={(e) => setCatInfo({ ...catInfo, name: e.target.value })}
              className="w-full px-6 py-4 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
              placeholder="Masukkan nama kucing"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Umur *
            </label>
            <input
              type="text"
              value={catInfo.age}
              onChange={(e) => setCatInfo({ ...catInfo, age: e.target.value })}
              className="w-full px-6 py-4 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
              placeholder="Contoh: 2 tahun"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Berat Badan (kg)
            </label>
            <input
              type="number"
              value={catInfo.weight || ''}
              onChange={(e) => setCatInfo({ ...catInfo, weight: parseFloat(e.target.value) || 4.0 })}
              className="w-full px-6 py-4 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
              placeholder="4.0"
              step="0.1"
              min="0.5"
              max="20"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Suhu Tubuh (°C)
            </label>
            <input
              type="number"
              value={catInfo.body_temperature || ''}
              onChange={(e) => setCatInfo({ ...catInfo, body_temperature: parseFloat(e.target.value) || 38.5 })}
              className="w-full px-6 py-4 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
              placeholder="38.5"
              step="0.1"
              min="35"
              max="42"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Jenis Kelamin *
            </label>
            <div className="grid grid-cols-2 gap-6">
              {["male", "female"].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setCatInfo({ ...catInfo, gender: gender as "male" | "female" })}
                  className={cn(
                    "p-6 rounded-xl text-lg font-medium transition-all flex items-center justify-center gap-3",
                    catInfo.gender === gender
                      ? "bg-[#FF823C] text-white shadow-lg shadow-[#FF823C]/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {gender === "male" ? (
                    <>
                      <IconMars className="w-6 h-6" />
                      Jantan
                    </>
                  ) : (
                    <>
                      <IconVenus className="w-6 h-6" />
                      Betina
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCatInfoSubmit}
          disabled={!catInfo.name || !catInfo.age || !catInfo.gender}
          className={cn(
            "w-full py-6 rounded-xl text-lg font-medium flex items-center justify-center gap-3 mt-8",
            catInfo.name && catInfo.age && catInfo.gender
              ? "bg-[#FF823C] text-white hover:bg-[#FF823C]/90 shadow-lg shadow-[#FF823C]/30"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Lanjutkan
          <IconArrowRight className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );

  const renderMethodSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <AnimatedGradientText className="text-2xl font-semibold mb-2">
          Hai {catInfo.name}! 👋
        </AnimatedGradientText>
        <p className="text-gray-600">
          Pilih metode deteksi yang ingin kamu gunakan
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect("image")}
          className="relative group bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF823C]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#FF823C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconCat className="w-8 h-8 text-[#FF823C]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Deteksi via Gambar</h3>
            <p className="text-gray-600 text-sm">
              Upload foto kucing Anda untuk mendeteksi ras dan potensi penyakit
            </p>
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Coming Soon
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect("questionnaire")}
          className="relative group bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF823C]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#FF823C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconPaw className="w-8 h-8 text-[#FF823C]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Deteksi via Kuisioner</h3>
            <p className="text-gray-600 text-sm">
              Jawab beberapa pertanyaan untuk analisis kesehatan kucing
            </p>
            <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              Available Now
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderImageDetection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {selectedImage ? (
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  width={800}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
              >
                <IconX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ) : (
            <label className="relative block w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#FF823C] transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative z-10"
              >
                <IconUpload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-[#FF823C] transition-colors" />
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Upload foto kucing Anda di sini
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Format yang didukung: JPG, PNG (Max. 5MB)
                </p>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF823C]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </label>
          )}

          {selectedImage && (
            <motion.button
              onClick={handleImageAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 bg-[#FF823C] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAnalyzing ? "Menganalisis..." : "Analisis Gambar (Demo)"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!predictionResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <IconPaw className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-800">Hasil Analisis</h3>

              {/* Data Section */}
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-600">Nama</p>
                    <p className="font-medium text-neutral-800">{catInfo.name}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-600">Usia</p>
                    <p className="font-medium text-neutral-800">{catInfo.age}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-600">Jenis Kelamin</p>
                    <p className="font-medium text-neutral-800">{catInfo.gender === 'male' ? 'Jantan' : 'Betina'}</p>
                  </div>
                </div>

                {/* Disease & Confidence */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-lg text-blue-800 mb-2">Prediksi Penyakit:</h4>
                  <p className="text-xl font-bold text-blue-900">{predictionResult.predicted_disease}</p>
                  <p className="text-blue-700 mt-2">Tingkat Keyakinan: {predictionResult.confidence}%</p>
                </div>

                {/* Diagnosis Section */}
                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                  <h4 className="font-semibold text-lg text-neutral-800 mb-4">Detail Diagnosis:</h4>
                  <div className="prose prose-neutral text-neutral-700">
                    <div dangerouslySetInnerHTML={{ __html: predictionResult.diagnosis }} />
                  </div>
                </div>
                
                {/* Recommendations Section */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-lg text-green-800 mb-4">Rekomendasi Penanganan:</h4>
                  <div className="prose prose-green text-green-700">
                    <div dangerouslySetInnerHTML={{ __html: predictionResult.recommendations }} />
                  </div>
                </div>

                {/* Active Symptoms */}
                {predictionResult.active_symptoms.length > 0 && (
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-lg text-orange-800 mb-2">Gejala yang Terdeteksi:</h4>
                    <div className="flex flex-wrap gap-2">
                      {predictionResult.active_symptoms.map((symptom, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning Section */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Catatan Penting:</h4>
                  <p className="text-red-700">
                    Hasil diagnosa ini memiliki tingkat akurasi {predictionResult.accuracy}% berdasarkan penelitian, yang berarti tidak 100% akurat. 
                    Layanan ini bersifat edukatif, bukan solutif, dan tidak menggantikan konsultasi medis profesional.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF823C] text-white rounded-xl font-medium hover:bg-[#FF823C]/90"
                  >
                    <IconDownload className="w-5 h-5" />
                    Cetak Hasil
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowResult(false);
                      setCurrentStep("method");
                      setDetectionMode(null);
                      setSelectedImage(null);
                      setAnswers({});
                      setPredictionResult(null);
                      setError(null);
                      setCurrentQuestionIndex(0);
                    }}
                    className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
                  >
                    Mulai Ulang
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionnaire = () => {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {!showResult ? (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-neutral-800 mb-2">
                    Kuisioner Deteksi Penyakit
                  </h3>
                  <p className="text-neutral-600">
                    Jawab semua pertanyaan di bawah ini untuk mendeteksi kemungkinan penyakit pada {catInfo.name}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentQuestionIndex
                            ? "bg-green-500"
                            : index < currentQuestionIndex
                            ? "bg-neutral-300"
                            : "bg-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuestionWrapper
                      question={currentQuestion.text}
                      gejala={answers[currentQuestion.id]}
                      setToYes={() => handleAnswer(currentQuestion.id, true)}
                      setToNo={() => handleAnswer(currentQuestion.id, false)}
                      setToNull={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: null }))}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-center mt-8">
                  {currentQuestionIndex > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreviousQuestion}
                      className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-medium hover:bg-neutral-200"
                    >
                      ← Sebelumnya
                    </motion.button>
                  ) : <div />}

                  {currentQuestionIndex === questions.length - 1 && Object.values(answers).every(answer => answer !== null) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleQuestionnaireSubmit}
                      disabled={isAnalyzing}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? "Menganalisis..." : "Analisis Gejala"}
                    </motion.button>
                  )}
                </div>
              </div>
            ) : (
              renderResults()
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-balance text-3xl font-semibold leading-none tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              Selamat Datang di{" "}
              <LineShadowText className="italic" shadowColor="#FF823C">
                PurrPal AI
              </LineShadowText>
            </h2>
            <p className="text-gray-600 mt-4">
              Deteksi dini kesehatan kucing Anda dengan bantuan AI
            </p>
          </motion.div>
        </div>

        {/* Back Button */}
        {currentStep !== "info" && !showResult && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              if (currentStep === "method") {
                setCurrentStep("info");
              } else if (currentStep === "detection") {
                setCurrentStep("method");
                setDetectionMode(null);
                setSelectedImage(null);
                setAnswers({});
                setShowResult(false);
                setError(null);
                setCurrentQuestionIndex(0);
              }
            }}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Kembali
          </motion.button>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === "info" && renderCatInfoForm()}
          {currentStep === "method" && renderMethodSelection()}
          {currentStep === "detection" && (
            detectionMode === "image" ? renderImageDetection() : renderQuestionnaire()
          )}
        </AnimatePresence>

        {/* Loading States */}
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isAnalyzing}
          duration={2000}
          loop={false}
        />
      </div>
    </div>
  );
}