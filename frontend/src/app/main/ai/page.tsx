"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconUpload, 
  IconX, 
  IconCat, 
  IconPaw, 
  IconArrowRight, 
  IconDownload, 
  IconMars, 
  IconVenus,
  IconStethoscope,
  IconClock,
  IconStar,
  IconMap2,
  IconMapPin
} from "@tabler/icons-react";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { QuestionWrapper } from "@/components/ui/question-wrapper";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Expandable, ExpandableTrigger, ExpandableCard, ExpandableCardHeader, ExpandableCardContent, ExpandableContent } from "@/components/ui/expandable";
import { Badge } from "@/components/ui/badge";

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

  // Reset states when changing detection mode
  useEffect(() => {
    if (detectionMode === null) {
      setSelectedImage(null);
      setShowResult(false);
      setPredictionResult(null);
      setError(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
    }
  }, [detectionMode]);

  // Reset error when selecting new image
  useEffect(() => {
    if (selectedImage) {
      setError(null);
    }
  }, [selectedImage]);

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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimum 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar (JPG, PNG).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Validate image dimensions
        const img = document.createElement('img') as HTMLImageElement;
        img.onload = () => {
          // Minimum dimensions 64x64
          if (img.width < 64 || img.height < 64) {
            setError('Resolusi gambar terlalu kecil. Minimum 64x64 piksel.');
            return;
          }
          setSelectedImage(reader.result as string);
          setError(null);
        };
        img.onerror = () => {
          setError('Format gambar tidak valid.');
        };
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.onerror = () => {
        setError('Gagal membaca file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) return;
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to use AI features');
      }

      console.log('Sending request to AI service...', {
        image_size: selectedImage.length,
        cat_info: catInfo
      });

      // Call the backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/ai/detect-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_url: selectedImage,
          cat_info: {
            name: catInfo.name,
            age: catInfo.age,
            gender: catInfo.gender,
            weight: catInfo.weight || 4.0,
            body_temperature: catInfo.body_temperature || 38.5,
            duration_days: catInfo.duration_days || 3,
            heart_rate: catInfo.heart_rate || 120
          }
        }),
      });

      // Check if response is ok and is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Vision service prediction failed');
      }

      console.log('Setting prediction result:', result.data);
      setPredictionResult(result.data);
      setShowResult(true);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('login')) {
          setError('Silakan login terlebih dahulu untuk menggunakan fitur AI.');
        } else if (error.message.includes('unavailable')) {
          setError('Layanan AI sedang tidak tersedia. Silakan coba lagi nanti.');
        } else if (error.message.includes('Invalid image')) {
          setError('Format gambar tidak valid. Gunakan format JPG atau PNG.');
        } else if (error.message.includes('non-JSON')) {
          setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
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

  // Add debug log for showResult and predictionResult changes
  useEffect(() => {
    console.log('Show Result:', showResult);
    console.log('Prediction Result:', predictionResult);
  }, [showResult, predictionResult]);

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

      // Check if response is ok and is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
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
        } else if (error.message.includes('non-JSON')) {
          setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
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
      ${predictionResult.diagnosis.replace(/<[^>]*>/g, '').trim()}

      Rekomendasi Penanganan:
      ${predictionResult.recommendations.replace(/<[^>]*>/g, '').trim()}

      Gejala yang Terdeteksi:
      ${predictionResult.active_symptoms.join(', ')}

      Catatan Penting:
      Hasil diagnosa ini memiliki tingkat akurasi ${predictionResult.accuracy}% berdasarkan penelitian, 
      yang berarti tidak 100% akurat. Layanan ini bersifat edukatif, bukan solutif, dan tidak menggantikan konsultasi medis profesional.
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
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <AnimatedGradientText className="text-3xl font-semibold mb-2">
          Hai {catInfo.name}! 👋
        </AnimatedGradientText>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          PurrPal AI menyediakan dua metode deteksi penyakit yang akurat. Pilih metode yang sesuai dengan kebutuhan Anda.
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Detection Card */}
        <motion.button
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect("image")}
          className="relative group bg-white p-8 rounded-2xl shadow-lg text-left hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF823C]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 bg-[#FF823C]/10 rounded-2xl flex items-center justify-center">
                <IconCat className="w-8 h-8 text-[#FF823C]" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 px-3 py-1">
                Available Now
              </Badge>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-2">Deteksi via Gambar</h3>
              <p className="text-gray-600">
                Upload foto kucing Anda untuk mendeteksi penyakit kulit dengan teknologi AI canggih
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconStethoscope className="w-4 h-4 text-[#FF823C]" />
                <span>Deteksi visual penyakit kulit</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconClock className="w-4 h-4 text-[#FF823C]" />
                <span>Hasil analisis dalam hitungan detik</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconStar className="w-4 h-4 text-[#FF823C]" />
                <span>Akurasi tinggi berdasarkan dataset veteriner</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#FF823C] font-medium">
              Mulai Deteksi
              <IconArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* Questionnaire Card */}
        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect("questionnaire")}
          className="relative group bg-white p-8 rounded-2xl shadow-lg text-left hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF823C]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 bg-[#FF823C]/10 rounded-2xl flex items-center justify-center">
                <IconPaw className="w-8 h-8 text-[#FF823C]" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 px-3 py-1">
                Available Now
              </Badge>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-2">Deteksi via Kuisioner</h3>
              <p className="text-gray-600">
                Jawab serangkaian pertanyaan untuk analisis menyeluruh kesehatan kucing Anda
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconStethoscope className="w-4 h-4 text-[#FF823C]" />
                <span>Analisis komprehensif berbagai gejala</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconClock className="w-4 h-4 text-[#FF823C]" />
                <span>Kuisioner singkat dan mudah</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconStar className="w-4 h-4 text-[#FF823C]" />
                <span>Rekomendasi penanganan detail</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#FF823C] font-medium">
              Mulai Kuisioner
              <IconArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Additional Information Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <IconStethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Diagnosis Akurat</h3>
          <p className="text-gray-600 text-sm">
            Model AI kami dilatih dengan dataset veteriner yang luas dan terus diperbarui untuk memberikan diagnosis yang akurat dan terpercaya.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <IconClock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Deteksi Cepat</h3>
          <p className="text-gray-600 text-sm">
            Dapatkan hasil analisis kesehatan kucing Anda dalam hitungan detik dengan teknologi AI canggih dan pemrosesan real-time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <IconStar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Rekomendasi Tepat</h3>
          <p className="text-gray-600 text-sm">
            Terima saran penanganan yang disesuaikan dengan kondisi kucing Anda dari database veteriner kami yang komprehensif.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderImageDetection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {!showResult ? (
            <>
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {selectedImage && (
                <motion.button
                  onClick={handleImageAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-[#FF823C] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAnalyzing ? "Menganalisis..." : "Analisis Gambar"}
                </motion.button>
              )}
            </>
          ) : (
            renderResults()
          )}
        </div>
      </div>

      {/* Loading States */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isAnalyzing}
        duration={2000}
        loop={false}
      />
    </div>
  );

  const renderResults = () => {
    if (!predictionResult) return null;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#FF823C] bg-opacity-10 rounded-2xl flex items-center justify-center">
            <IconPaw className="w-8 h-8 text-[#FF823C]" />
          </div>
          <h2 className="text-2xl font-semibold">Hasil Analisis</h2>
          <p className="text-gray-600">
            {detectionMode === 'image' 
              ? `Berikut hasil analisis gambar untuk ${catInfo.name}`
              : `Berikut hasil analisis gejala untuk ${catInfo.name}`
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Info Kucing */}
          <div>
            <h3 className="font-medium mb-4">Informasi Kucing</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{catInfo.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Usia</span>
                <span className="font-medium">{catInfo.age}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Jenis Kelamin</span>
                <div className="flex items-center gap-2">
                  {catInfo.gender === 'male' ? (
                    <IconMars className="w-4 h-4 text-blue-500" />
                  ) : (
                    <IconVenus className="w-4 h-4 text-pink-500" />
                  )}
                  <span className="font-medium">
                    {catInfo.gender === 'male' ? 'Jantan' : 'Betina'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hasil Deteksi */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Hasil Deteksi</h3>
              <Badge variant="outline" className="bg-green-50">
                AI Prediction
              </Badge>
            </div>

            {/* Jika metode gambar, tampilkan gambar yang dianalisis */}
            {detectionMode === 'image' && selectedImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Gambar yang Dianalisis</p>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Analyzed cat"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Hasil prediksi penyakit */}
            <div className="bg-orange-50 p-4 rounded-xl">
              <h4 className="font-medium text-lg mb-2">
                {predictionResult.predicted_disease}
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-[#FF823C] h-2 rounded-full"
                  style={{
                    width: `${predictionResult.confidence}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Tingkat keyakinan: {predictionResult.confidence}%
              </p>
            </div>
          </div>
        </div>

        {/* Diagnosis & Rekomendasi */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <IconStethoscope className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Diagnosis</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Berdasarkan {detectionMode === 'image' ? 'analisis gambar' : 'gejala yang diberikan'}, 
                kucing Anda kemungkinan mengalami {predictionResult.predicted_disease}.
              </p>
              <p className="text-sm text-gray-600">
                {predictionResult.diagnosis.replace(/<[^>]*>/g, '').trim()}
              </p>
              {predictionResult.active_symptoms && predictionResult.active_symptoms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Gejala yang terdeteksi:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {predictionResult.active_symptoms.map((symptom, idx) => (
                      <li key={idx}>{symptom.replace(/<[^>]*>/g, '').trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <IconStar className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Rekomendasi</h3>
            </div>
            <div className="space-y-2">
              {predictionResult.recommendations.split('\n').map((rec, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {rec.replace(/<[^>]*>/g, '').trim()}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={() => {
              setCurrentStep("info");
              setDetectionMode(null);
              setSelectedImage(null);
              setShowResult(false);
              setPredictionResult(null);
              setError(null);
              setAnswers({});
              setCurrentQuestionIndex(0);
              setCatInfo({
                name: "",
                age: "",
                gender: "",
                weight: 4.0,
                body_temperature: 38.5,
                duration_days: 3,
                heart_rate: 120
              });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
          >
            <IconX className="w-4 h-4" />
            Kembali
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF823C] hover:bg-[#ff7223] text-white rounded-xl transition-colors"
          >
            <IconDownload className="w-4 h-4" />
            Unduh Hasil
          </button>
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