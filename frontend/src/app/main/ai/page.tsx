"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload, IconX, IconCat, IconPaw, IconArrowRight, IconDownload, IconMars, IconVenus, IconStethoscope, IconClock, IconStar, IconMap2, IconMapPin } from "@tabler/icons-react";
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
      const response = await fetch(`${apiUrl}/api/ai/detect-image`, {
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

      console.log('Response status:', response.status);
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <AnimatedGradientText className="text-3xl font-semibold mb-4">
          <span className="font-poppins">Hai {catInfo.name}! 👋</span>
        </AnimatedGradientText>
        <p className="text-gray-600 text-lg mb-8 font-poppins">
          Pilih metode deteksi yang ingin kamu gunakan untuk memeriksa kesehatan kucing
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Detection Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Deteksi via Gambar</h3>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <IconMap2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Unggah foto kucing Anda dan AI kami akan menganalisis kondisi kesehatannya secara visual.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <IconStethoscope className="w-5 h-5 text-blue-500" />
                <span>Identifikasi ras kucing</span>
              </li>
              <li className="flex items-center gap-2">
                <IconClock className="w-5 h-5 text-blue-500" />
                <span>Deteksi tanda-tanda penyakit dari ciri fisik</span>
              </li>
              <li className="flex items-center gap-2">
                <IconStar className="w-5 h-5 text-blue-500" />
                <span>Analisis kondisi bulu dan kulit</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                *Fitur ini akan segera hadir. Kami sedang menyempurnakan model AI untuk memberikan hasil yang lebih akurat.
              </p>
            </div>
          </div>
        </div>

        {/* Questionnaire Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Deteksi via Kuisioner</h3>
                <Badge variant="default" className="mt-2">Available Now</Badge>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <IconMapPin className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Jawab beberapa pertanyaan tentang kondisi kucing Anda untuk mendapatkan analisis kesehatan yang komprehensif.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <IconStethoscope className="w-5 h-5 text-green-500" />
                <span>14 pertanyaan diagnostik yang mudah dijawab</span>
              </li>
              <li className="flex items-center gap-2">
                <IconClock className="w-5 h-5 text-green-500" />
                <span>Analisis gejala komprehensif dengan AI</span>
              </li>
              <li className="flex items-center gap-2">
                <IconStar className="w-5 h-5 text-green-500" />
                <span>Rekomendasi penanganan yang tepat</span>
              </li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => handleMethodSelect("questionnaire")}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Mulai Diagnosa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <IconStethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Diagnosis Akurat</h3>
          <p className="text-gray-600">
            Model AI kami dilatih dengan dataset veteriner yang luas untuk memberikan diagnosis yang akurat dan terpercaya.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <IconClock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Deteksi Cepat</h3>
          <p className="text-gray-600">
            Dapatkan hasil analisis kesehatan kucing Anda dalam hitungan detik dengan teknologi AI canggih.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <IconStar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Rekomendasi Tepat</h3>
          <p className="text-gray-600">
            Terima saran penanganan yang disesuaikan dengan kondisi kucing Anda dari database veteriner kami.
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
    console.log('Rendering results with:', {
      showResult,
      predictionResult,
      selectedImage
    });

    if (!predictionResult) {
      console.log('No prediction result available');
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Header Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF823C] to-[#FFA26B] rounded-2xl flex items-center justify-center">
                  <IconPaw className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-800 mb-2">Hasil Analisis</h3>
                  <p className="text-neutral-600">Berikut hasil analisis gambar untuk {catInfo.name}</p>
                </div>
              </div>

              {/* Image and Prediction Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Original Image */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-neutral-700">Gambar yang Dianalisis</h4>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#FF823C]/20">
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt="Analyzed"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Right: Prediction Results */}
                <div className="space-y-6">
                  {/* Cat Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <p className="text-sm text-neutral-500">Nama</p>
                      <p className="font-medium text-neutral-800">{catInfo.name}</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <p className="text-sm text-neutral-500">Usia</p>
                      <p className="font-medium text-neutral-800">{catInfo.age}</p>
                    </div>
                  </div>

                  {/* Prediction Result */}
                  <div className="bg-gradient-to-br from-[#FF823C]/10 to-[#FFA26B]/10 p-6 rounded-xl border border-[#FF823C]/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-[#FF823C]">Hasil Deteksi</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-green-600">AI Prediction</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-neutral-800 mb-2">
                      {predictionResult.predicted_disease}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${predictionResult.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#FF823C] to-[#FFA26B]"
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-600">
                        {predictionResult.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Diagnosis */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <IconCat className="w-5 h-5 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Diagnosis</h4>
                  </div>
                  <div className="prose prose-blue text-blue-700 max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: predictionResult.diagnosis }} />
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <IconPaw className="w-5 h-5 text-green-500" />
                    </div>
                    <h4 className="font-semibold text-lg text-green-800">Rekomendasi</h4>
                  </div>
                  <div className="prose prose-green text-green-700 max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: predictionResult.recommendations }} />
                  </div>
                </div>
              </div>

              {/* Symptoms and Warning */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Active Symptoms */}
                {predictionResult.active_symptoms.length > 0 && (
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <IconPaw className="w-5 h-5 text-orange-500" />
                      </div>
                      <h4 className="font-semibold text-lg text-orange-800">Gejala Terdeteksi</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {predictionResult.active_symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      ⚠️
                    </div>
                    <h4 className="font-semibold text-lg text-red-800">Catatan Penting</h4>
                  </div>
                  <p className="text-red-700">
                    Hasil diagnosa ini memiliki tingkat akurasi {predictionResult.accuracy}% berdasarkan penelitian, 
                    yang berarti tidak 100% akurat. Layanan ini bersifat edukatif, bukan solutif, dan tidak 
                    menggantikan konsultasi medis profesional.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#FF823C] text-white rounded-xl font-medium hover:bg-[#FF823C]/90 shadow-lg shadow-[#FF823C]/20"
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
                  className="flex-1 py-4 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
                >
                  Mulai Ulang
                </motion.button>
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