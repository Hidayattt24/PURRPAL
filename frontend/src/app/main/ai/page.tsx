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
}

interface Question {
  id: string;
  text: string;
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
    gender: ""
  });
  const [detectionMode, setDetectionMode] = useState<DetectionMode>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [accuracy, setAccuracy] = useState("");

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
      
      // Convert base64 string to blob for upload
      const base64Data = selectedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'cat_image.jpg');
      formData.append('catInfo', JSON.stringify(catInfo));

      // Make API call to backend
      const response = await fetch('/api/classify-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      
      // Update state with results (you'll need to add these states)
      setDiagnosis(result.diagnosis);
      setRecommendations(result.recommendations);
      setAccuracy(result.accuracy);
      
      setShowResult(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.');
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

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 10000));
    setIsAnalyzing(false);
    setShowResult(true);
  };

  const handlePrint = () => {
    const printContent = `
      Data Anda:
      Nama: ${catInfo.name}
      Usia: ${catInfo.age}
      Jenis Kelamin: ${catInfo.gender === 'male' ? 'Jantan' : 'Betina'}

      Hasil Diagnosis:
      ${diagnosis}

      Rekomendasi Penanganan:
      ${recommendations}

      Catatan Penting:
      Hasil diagnosa ini memiliki tingkat akurasi ${accuracy}% berdasarkan penelitian, yang berarti tidak 100% akurat. 
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
      printWindow.document.write(printContent.split('\\n').map(line => `<p>${line}</p>`).join(''));
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
              Nama Kucing
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
              Umur
            </label>
            <input
              type="text"
              value={catInfo.age}
              onChange={(e) => setCatInfo({ ...catInfo, age: e.target.value })}
              className="w-full px-6 py-4 rounded-xl text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF823C] focus:border-transparent"
              placeholder="Contoh: 2 tahun"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Jenis Kelamin
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
              {isAnalyzing ? "Menganalisis..." : "Analisis Gambar"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
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

              {/* Diagnosis Section */}
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                <h4 className="font-semibold text-lg text-neutral-800 mb-4">Hasil Diagnosis:</h4>
                <div className="space-y-4">
                  <p className="text-neutral-700">{diagnosis}</p>
                </div>
              </div>
              
              {/* Recommendations Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-neutral-800">Rekomendasi Penanganan:</h4>
                <div className="prose prose-neutral">
                  {recommendations && (
                    <div dangerouslySetInnerHTML={{ __html: recommendations }} />
                  )}
                </div>
              </div>

              {/* Warning Section */}
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h4 className="font-semibold text-red-800 mb-2">Catatan Penting:</h4>
                <p className="text-red-700">
                  Hasil diagnosa ini memiliki tingkat akurasi {accuracy}% berdasarkan penelitian, yang berarti tidak 100% akurat. 
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
                    setDiagnosis("");
                    setRecommendations("");
                    setAccuracy("");
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
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
                    >
                      Analisis Gejala
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