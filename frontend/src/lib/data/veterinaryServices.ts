export interface VeterinaryService {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  openHours: string;
  services: string[];
  position: [number, number];
  googleMapUrl: string;
}

export const veterinaryServices: VeterinaryService[] = [
    {
      "id": 1,
      "name": "Syiah Kuala Petshop & Vet Care",
      "address": "Jl. Teuku Nyak Arief No.3, Lamgugob, Kec. Syiah Kuala, Kota Banda Aceh, Aceh 23115, Indonesia",
      "phone": "+62 852-6064-9509",
      "rating": 4.7,
      "totalReviews": 130,
      "openHours": "09:00 - 22:00",
      "services": ["Klinik Hewan", "Grooming", "Penjualan Pakan", "Aksesoris"],
      "position": [5.5704, 95.3439],
      "googleMapUrl": "https://www.google.com/maps?q=Syiah+Kuala+Petshop+%26+Vet+Care,Banda+Aceh"
    },
    {
      "id": 2,
      "name": "ZOO Petshop & Practice",
      "address": "Jl. Todak No.45, Lamprit, Kec. Kuta Alam, Kota Banda Aceh, Aceh 23126, Indonesia",
      "phone": "+62 822-8339-6619",
      "rating": 4.8,
      "totalReviews": 95,
      "openHours": "09:00 - 21:00",
      "services": ["Praktik Dokter Hewan", "Grooming", "Pakan Hewan", "Obat-obatan"],
      "position": [5.5646, 95.3340],
      "googleMapUrl": "https://www.google.com/maps?q=ZOO+Petshop+%26+Practice,Banda+Aceh"
    },
    {
      "id": 3,
      "name": "Arafah Petshop",
      "address": "Jl. Prof. Ali Hasyimi, Lamteh, Kec. Ulee Kareng, Kota Banda Aceh, Aceh 23118, Indonesia",
      "phone": "+62 852-7788-9990",
      "rating": 4.6,
      "totalReviews": 88,
      "openHours": "09:00 - 22:00",
      "services": ["Penjualan Pakan", "Aksesoris", "Kandang", "Mainan Hewan"],
      "position": [5.5806, 95.3524],
      "googleMapUrl": "https://www.google.com/maps?q=Arafah+Petshop,Banda+Aceh"
    },
    {
      "id": 4,
      "name": "Meowgind Petshop & Care",
      "address": "Jl. K. H. Ahmad Dahlan, Kp. Baru, Kec. Baiturrahman, Kota Banda Aceh, Aceh 23116, Indonesia",
      "phone": "+62 822-7202-0900",
      "rating": 4.9,
      "totalReviews": 75,
      "openHours": "10:00 - 22:00",
      "services": ["Perawatan Hewan", "Grooming", "Pakan Kucing & Anjing", "Vitamin"],
      "position": [5.5524, 95.3184],
      "googleMapUrl": "https://www.google.com/maps?q=Meowgind+Petshop+%26+Care,Banda+Aceh"
    },
    {
      "id": 5,
      "name": "Rahmat Pet Shop",
      "address": "Jl. Teuku Umar No.264, Geuceu Kayee Jato, Kec. Banda Raya, Kota Banda Aceh, Aceh 23232, Indonesia",
      "phone": "+62 852-6009-8839",
      "rating": 4.5,
      "totalReviews": 60,
      "openHours": "08:30 - 18:00",
      "services": ["Pakan Burung", "Pakan Ikan", "Akuarium", "Sangkar"],
      "position": [5.5416, 95.3201],
      "googleMapUrl": "https://www.google.com/maps?q=Rahmat+Pet+Shop,Banda+Aceh"
    },
    {
      "id": 6,
      "name": "Aceh Pet Care",
      "address": "Jl. Pocut Baren No. 55, Laksana, Kec. Kuta Alam, Kota Banda Aceh, Aceh",
      "phone": "+62 812-3456-7890",
      "rating": 4.8,
      "totalReviews": 55,
      "openHours": "09:00 - 20:00",
      "services": ["Konsultasi Dokter Hewan", "Vaksinasi", "Grooming Medis", "Pakan Terapeutik"],
      "position": [5.5562, 95.3217],
      "googleMapUrl": "https://www.google.com/maps?q=Aceh+Pet+Care,Banda+Aceh"
    },
    {
      "id": 7,
      "name": "Meutia Petshop",
      "address": "Jl. Pante Riek No. 12, Geuceu Iniem, Kec. Banda Raya, Kota Banda Aceh, Aceh",
      "phone": "+62 853-1122-3344",
      "rating": 4.5,
      "totalReviews": 45,
      "openHours": "08:30 - 21:30",
      "services": ["Pakan Ikan Hias", "Akuarium", "Pakan Kucing", "Aksesoris"],
      "position": [5.5401, 95.3275],
      "googleMapUrl": "https://www.google.com/maps?q=Meutia+Petshop,Banda+Aceh"
    },
    {
      "id": 8,
      "name": "Petshop Indonesia - Medan",
      "address": "Jl. Asia No.119-121, Sei Rengas I, Kec. Medan Kota, Kota Medan, Sumatera Utara 20211, Indonesia",
      "phone": "+62 851-0081-9993",
      "rating": 4.7,
      "totalReviews": 1500,
      "openHours": "09:00 - 21:00",
      "services": ["Grooming", "Klinik Hewan", "Pet Hotel", "Penjualan Pakan & Aksesoris"],
      "position": [3.5828, 98.6894],
      "googleMapUrl": "https://www.google.com/maps?q=Petshop+Indonesia,Medan"
    },
    {
      "id": 9,
      "name": "Istana Petshop Medan",
      "address": "Jl. Multatuli No.8, Hamdan, Kec. Medan Maimun, Kota Medan, Sumatera Utara 20151, Indonesia",
      "phone": "+62 61 4568886",
      "rating": 4.6,
      "totalReviews": 950,
      "openHours": "09:00 - 20:00",
      "services": ["Penjualan Pakan", "Aksesoris", "Grooming", "Vitamin"],
      "position": [3.5768, 98.6752],
      "googleMapUrl": "https://www.google.com/maps?q=Istana+Petshop,Medan"
    },
    {
      "id": 10,
      "name": "Pet & Co. Medan",
      "address": "Jl. S. Parman No.215, Petisah Hulu, Kec. Medan Baru, Kota Medan, Sumatera Utara 20152, Indonesia",
      "phone": "+62 813-7555-0911",
      "rating": 4.8,
      "totalReviews": 700,
      "openHours": "10:00 - 21:00",
      "services": ["Pet Cafe", "Grooming", "Pet Shop", "Dog Playground"],
      "position": [3.5888, 98.6625],
      "googleMapUrl": "https://www.google.com/maps?q=Pet+%26+Co,Medan"
    },
    {
      "id": 11,
      "name": "Cahaya Petshop Pekanbaru",
      "address": "Jl. Durian No.28, Labuh Baru Tim., Kec. Payung Sekaki, Kota Pekanbaru, Riau 28292, Indonesia",
      "phone": "+62 761 22233",
      "rating": 4.4,
      "totalReviews": 580,
      "openHours": "08:00 - 22:00",
      "services": ["Pakan Ikan & Burung", "Aksesoris", "Vitamin", "Grooming"],
      "position": [0.5135, 101.4286],
      "googleMapUrl": "https://www.google.com/maps?q=Cahaya+Petshop,Pekanbaru"
    },
    {
      "id": 12,
      "name": "Palembang Petshop",
      "address": "Jl. Jend. Sudirman No.KM. 3,5, Pahlawan, Kec. Kemuning, Kota Palembang, Sumatera Selatan 30128, Indonesia",
      "phone": "+62 711 357777",
      "rating": 4.5,
      "totalReviews": 650,
      "openHours": "08:30 - 20:30",
      "services": ["Penjualan Pakan", "Aksesoris", "Grooming", "Kandang"],
      "position": [-2.9697, 104.7599],
      "googleMapUrl": "https://www.google.com/maps?q=Palembang+Petshop"
    },
    {
      "id": 13,
      "name": "Charlie Petshop Padang",
      "address": "Jl. Damar No. 48, Olo, Kec. Padang Bar., Kota Padang, Sumatera Barat",
      "phone": "+62 751 890123",
      "rating": 4.6,
      "totalReviews": 300,
      "openHours": "09:00 - 21:00",
      "services": ["Grooming", "Pet Hotel", "Pakan Hewan", "Aksesoris"],
      "position": [-0.9452, 100.3562],
      "googleMapUrl": "https://www.google.com/maps?q=Charlie+Petshop,Padang"
    },
    {
      "id": 14,
      "name": "Pet Avenue by Petshop Indonesia",
      "address": "Jl. Radio Dalam Raya No.84, Gandaria Utara, Kec. Kby. Baru, Kota Jakarta Selatan, DKI Jakarta 12140, Indonesia",
      "phone": "+62 812-1212-9775",
      "rating": 4.8,
      "totalReviews": 2100,
      "openHours": "08:00 - 22:00",
      "services": ["Grooming", "Pet Hotel", "Klinik Hewan", "Toko Online"],
      "position": [-6.2526, 106.7865],
      "googleMapUrl": "https://www.google.com/maps?q=Pet+Avenue+by+Petshop+Indonesia,Jakarta"
    },
    {
      "id": 15,
      "name": "Zoom Pet City Jakarta",
      "address": "Jalan Kemang Timur 3A No.2, Bangka, Kec. Mampang Prpt., Kota Jakarta Selatan, DKI Jakarta 12730, Indonesia",
      "phone": "+62 877-7835-2777",
      "rating": 4.6,
      "totalReviews": 1800,
      "openHours": "09:00 - 19:00",
      "services": ["Pet Hotel", "Vet Care", "Kafe Kucing", "Grooming"],
      "position": [-6.2612, 106.8149],
      "googleMapUrl": "https://www.google.com/maps?q=Zoom+Pet+City,Jakarta"
    },
    {
      "id": 16,
      "name": "Groovy Pet Shop - Kemang",
      "address": "Jl. Kemang Raya No.44, Bangka, Kec. Mampang Prpt., Kota Jakarta Selatan, DKI Jakarta 12730, Indonesia",
      "phone": "+62 21 7197704",
      "rating": 4.5,
      "totalReviews": 1300,
      "openHours": "08:00 - 21:00",
      "services": ["Grooming", "Klinik Hewan", "Penjualan Pakan & Aksesoris", "Pet Delivery"],
      "position": [-6.2599, 106.8146],
      "googleMapUrl": "https://www.google.com/maps?q=Groovy+Pet+Shop,Kemang,Jakarta"
    },
    {
      "id": 17,
      "name": "Pet Kingdom - Lotte Shopping Avenue",
      "address": "Jl. Prof. DR. Satrio No.Kav 3-5, Karet Kuningan, Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12940, Indonesia",
      "phone": "+62 812-8001-5743",
      "rating": 4.7,
      "totalReviews": 900,
      "openHours": "10:00 - 22:00",
      "services": ["Grooming Salon", "Pet Shop", "Dog Training", "Pet Hotel"],
      "position": [-6.2241, 106.8225],
      "googleMapUrl": "https://www.google.com/maps?q=Pet+Kingdom,Lotte+Shopping+Avenue,Jakarta"
    },
    {
      "id": 18,
      "name": "Bejo PetMart (Pet Shop) Bandung",
      "address": "Jl. Peta No.170, Suka Asih, Kec. Bojongloa Kaler, Kota Bandung, Jawa Barat 40231, Indonesia",
      "phone": "+62 812-2488-9993",
      "rating": 4.8,
      "totalReviews": 1200,
      "openHours": "08:00 - 17:00",
      "services": ["Pakan Ternak", "Pakan Hewan Peliharaan", "Obat-obatan", "Aksesoris"],
      "position": [-6.9315, 107.5921],
      "googleMapUrl": "https://www.google.com/maps?q=Bejo+PetMart,Bandung"
    },
    {
      "id": 19,
      "name": "Pet Kingdom Ciwalk Bandung",
      "address": "Cihampelas Walk, Jl. Cihampelas No.160, Cipaganti, Kecamatan Coblong, Kota Bandung, Jawa Barat 40131, Indonesia",
      "phone": "+62 815-1100-2000",
      "rating": 4.9,
      "totalReviews": 1400,
      "openHours": "10:00 - 22:00",
      "services": ["Grooming", "Pet Hotel", "Toko Lengkap", "Dog Park"],
      "position": [-6.8966, 107.6053],
      "googleMapUrl": "https://www.google.com/maps?q=Pet+Kingdom+Ciwalk,Bandung"
    },
    {
      "id": 20,
      "name": "Amigo Petshop Jogja",
      "address": "Jl. Kaliurang No.KM.5, Karang Wuni, Caturtunggal, Kec. Depok, Kabupaten Sleman, DI Yogyakarta 55281, Indonesia",
      "phone": "+62 274 565123",
      "rating": 4.5,
      "totalReviews": 1100,
      "openHours": "08:00 - 21:00",
      "services": ["Grooming", "Klinik Hewan", "Penjualan Pakan", "Aksesoris"],
      "position": [-7.7634, 110.3838],
      "googleMapUrl": "https://www.google.com/maps?q=Amigo+Petshop,Yogyakarta"
    },
    {
      "id": 21,
      "name": "Feliz Petshop Semarang",
      "address": "Jl. Ngesrep Tim. V No.59, Sumurboto, Kec. Banyumanik, Kota Semarang, Jawa Tengah 50269, Indonesia",
      "phone": "+62 24 7471111",
      "rating": 4.7,
      "totalReviews": 1300,
      "openHours": "08:00 - 21:00",
      "services": ["Grooming", "Pet Hotel", "Klinik Hewan", "Penjualan Pakan"],
      "position": [-7.0454, 110.4189],
      "googleMapUrl": "https://www.google.com/maps?q=Feliz+Petshop,Semarang"
    },
    {
      "id": 22,
      "name": "Klinik Hewan Raja Petshop Surabaya",
      "address": "Ruko Galeri Bukit Indah, Jl. Pakuwon Indah No.45, Lontar, Kec. Sambikerep, Surabaya, Jawa Timur 60216, Indonesia",
      "phone": "+62 31 7391373",
      "rating": 4.7,
      "totalReviews": 850,
      "openHours": "08:00 - 17:00",
      "services": ["Klinik Hewan", "Vaksinasi", "Operasi", "Grooming"],
      "position": [-7.2891, 112.6728],
      "googleMapUrl": "https://www.google.com/maps?q=Klinik+Hewan+Raja+Petshop,Surabaya"
    },
    {
      "id": 23,
      "name": "Paws & Claws Malang",
      "address": "Jl. Bondowoso No.40, Gading Kasri, Kec. Klojen, Kota Malang, Jawa Timur 65115, Indonesia",
      "phone": "+62 812-3333-4444",
      "rating": 4.8,
      "totalReviews": 800,
      "openHours": "09:00 - 21:00",
      "services": ["Klinik Hewan", "Grooming", "Pet Shop", "Pet Hotel"],
      "position": [-7.9691, 112.6171],
      "googleMapUrl": "https://www.google.com/maps?q=Paws+%26+Claws,Malang"
    },
    {
      "id": 24,
      "name": "Hobi Pet Shop Bali",
      "address": "Jl. Teuku Umar Barat No.23, Padangsambian, Kec. Denpasar Bar., Kota Denpasar, Bali 80119, Indonesia",
      "phone": "+62 812-3838-333",
      "rating": 4.6,
      "totalReviews": 880,
      "openHours": "09:00 - 21:00",
      "services": ["Penjualan Pakan & Aksesoris", "Grooming", "Produk Impor"],
      "position": [-8.6789, 115.1843],
      "googleMapUrl": "https://www.google.com/maps?q=Hobi+Pet+Shop,Denpasar,Bali"
    },
    {
      "id": 25,
      "name": "Pecinta Satwa Petshop Makassar",
      "address": "Jl. Gn. Bawakaraeng No.128, Wajo Baru, Kec. Bontoala, Kota Makassar, Sulawesi Selatan 90156, Indonesia",
      "phone": "+62 852-5559-9399",
      "rating": 4.5,
      "totalReviews": 750,
      "openHours": "09:00 - 22:00",
      "services": ["Penjualan Pakan", "Aksesoris", "Grooming", "Konsultasi"],
      "position": [-5.1322, 119.4208],
      "googleMapUrl": "https://www.google.com/maps?q=Pecinta+Satwa+Petshop,Makassar"
    },
    {
      "id": 26,
      "name": "Borneo Petshop Balikpapan",
      "address": "Jl. Ruhui Rahayu No.88, Sepinggan, Kecamatan Balikpapan Selatan, Kota Balikpapan, Kalimantan Timur 76115, Indonesia",
      "phone": "+62 812-5888-889",
      "rating": 4.7,
      "totalReviews": 720,
      "openHours": "09:00 - 21:00",
      "services": ["Grooming", "Penitipan Hewan", "Penjualan Pakan", "Aksesoris"],
      "position": [-1.2655, 116.8833],
      "googleMapUrl": "https://www.google.com/maps?q=Borneo+Petshop,Balikpapan"
    },
    {
      "id": 27,
      "name": "Golden Petshop Pontianak",
      "address": "Jl. Gajah Mada No. 8, Benua Melayu Darat, Kec. Pontianak Sel., Kota Pontianak, Kalimantan Barat",
      "phone": "+62 561 737373",
      "rating": 4.5,
      "totalReviews": 600,
      "openHours": "08:00 - 21:00",
      "services": ["Pakan Hewan", "Aksesoris", "Grooming", "Obat-obatan"],
      "position": [-0.0354, 109.3331],
      "googleMapUrl": "https://www.google.com/maps?q=Golden+Petshop,Pontianak"
    },
    {
      "id": 28,
      "name": "Jayapura Pet Shop",
      "address": "Jl. Raya Abepura No. 50, Kotaraja, Kec. Abepura, Kota Jayapura, Papua",
      "phone": "+62 967 581234",
      "rating": 4.4,
      "totalReviews": 250,
      "openHours": "09:00 - 19:00",
      "services": ["Pakan Anjing", "Pakan Kucing", "Kandang", "Vitamin"],
      "position": [-2.5997, 140.6749],
      "googleMapUrl": "https://www.google.com/maps?q=Jayapura+Pet+Shop"
    },
    {
      "id": 29,
      "name": "Lombok Pet Care",
      "address": "Jl. Pejanggik No. 33, Cakranegara, Kota Mataram, Nusa Tenggara Bar.",
      "phone": "+62 370 636363",
      "rating": 4.7,
      "totalReviews": 350,
      "openHours": "09:00 - 21:00",
      "services": ["Klinik Hewan", "Grooming", "Pet Hotel", "Toko"],
      "position": [-8.5912, 116.1213],
      "googleMapUrl": "https://www.google.com/maps?q=Lombok+Pet+Care"
    },
    {
      "id": 30,
      "name": "Pet City BSD",
      "address": "Ruko Bidex, Jl. Pahlawan Seribu No.C3, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan, Banten",
      "phone": "+62 21 5370836",
      "rating": 4.6,
      "totalReviews": 1400,
      "openHours": "08:00 - 21:00",
      "services": ["Grooming", "Pet Hotel", "Klinik Hewan", "Toko"],
      "position": [-6.2942, 106.6622],
      "googleMapUrl": "https://www.google.com/maps?q=Pet+City+BSD,Tangerang"
    },
    {
      "id": 31,
      "name": "Poopy Petshop Cirebon",
      "address": "Jl. Cipto Mangunkusumo No.10, Pekiringan, Kec. Kesambi, Kota Cirebon, Jawa Barat",
      "phone": "+62 231 202020",
      "rating": 4.7,
      "totalReviews": 800,
      "openHours": "08:00 - 21:00",
      "services": ["Grooming", "Pakan", "Aksesoris", "Penitipan"],
      "position": [-6.7267, 108.5501],
      "googleMapUrl": "https://www.google.com/maps?q=Poopy+Petshop,Cirebon"
    },
    {
      "id": 32,
      "name": "Hachi Pet Shop Solo",
      "address": "Jl. Yosodipuro No.130, Mangkubumen, Kec. Banjarsari, Kota Surakarta, Jawa Tengah",
      "phone": "+62 271 737373",
      "rating": 4.8,
      "totalReviews": 950,
      "openHours": "09:00 - 21:00",
      "services": ["Grooming", "Klinik Hewan", "Toko", "Aksesoris"],
      "position": [-7.5583, 110.8113],
      "googleMapUrl": "https://www.google.com/maps?q=Hachi+Pet+Shop,Solo"
    },
    {
      "id": 33,
      "name": "Bintang Jaya Petshop Jambi",
      "address": "Jl. Kol. Abunjani No.8, Selamat, Kec. Telanaipura, Kota Jambi, Jambi",
      "phone": "+62 741 60006",
      "rating": 4.5,
      "totalReviews": 500,
      "openHours": "08:00 - 20:00",
      "services": ["Pakan Ternak", "Pakan Hewan", "Obat-obatan", "Aksesoris"],
      "position": [-1.5946, 103.5935],
      "googleMapUrl": "https://www.google.com/maps?q=Bintang+Jaya+Petshop,Jambi"
    },
    {
      "id": 34,
      "name": "Lampung Pet Center",
      "address": "Jl. Wolter Monginsidi No.12, Durian Payung, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung",
      "phone": "+62 721 484848",
      "rating": 4.6,
      "totalReviews": 600,
      "openHours": "09:00 - 21:00",
      "services": ["Klinik Hewan", "Grooming", "Toko", "Pet Hotel"],
      "position": [-5.4246, 105.2559],
      "googleMapUrl": "https://www.google.com/maps?q=Lampung+Pet+Center"
    },
    {
      "id": 35,
      "name": "Bogor Petshop",
      "address": "Jl. Pajajaran Indah V No.10, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat",
      "phone": "+62 251 8383838",
      "rating": 4.5,
      "totalReviews": 850,
      "openHours": "08:30 - 20:30",
      "services": ["Pakan", "Aksesoris", "Grooming", "Kandang"],
      "position": [-6.6083, 106.8174],
      "googleMapUrl": "https://www.google.com/maps?q=Bogor+Petshop"
    },
    {
      "id": 36,
      "name": "Bekasi Pet Planet",
      "address": "Ruko Grand Galaxy City, Jl. Boulevard Raya Tim. No.5, Jaka Setia, Kec. Bekasi Sel., Kota Bks, Jawa Barat",
      "phone": "+62 21 82731111",
      "rating": 4.7,
      "totalReviews": 900,
      "openHours": "09:00 - 22:00",
      "services": ["Grooming", "Pet Hotel", "Toko", "Klinik Hewan"],
      "position": [-6.2709, 106.9839],
      "googleMapUrl": "https://www.google.com/maps?q=Bekasi+Pet+Planet"
    },
    {
      "id": 37,
      "name": "Depok Pet's Village",
      "address": "Jl. Margonda Raya No.280, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat",
      "phone": "+62 21 77218888",
      "rating": 4.6,
      "totalReviews": 1100,
      "openHours": "09:00 - 21:00",
      "services": ["Toko", "Grooming", "Klinik Hewan", "Aksesoris"],
      "position": [-6.3683, 106.8327],
      "googleMapUrl": "https://www.google.com/maps?q=Depok+Pet's+Village"
    },
    {
      "id": 38,
      "name": "Ocean Blue Petshop Batam",
      "address": "Komp. Ruko Nagoya Hill, Jl. Teuku Umar, Lubuk Baja Kota, Kec. Lubuk Baja, Kota Batam, Kepulauan Riau",
      "phone": "+62 778 454545",
      "rating": 4.5,
      "totalReviews": 700,
      "openHours": "10:00 - 21:00",
      "services": ["Ikan Hias", "Akuarium", "Pakan Ikan", "Aksesoris"],
      "position": [1.1444, 104.0016],
      "googleMapUrl": "https://www.google.com/maps?q=Ocean+Blue+Petshop,Batam"
    },
    {
      "id": 39,
      "name": "Pangkal Pinang Pet House",
      "address": "Jl. Jend. Sudirman No. 45, Gabek, Kota Pangkal Pinang, Kepulauan Bangka Belitung",
      "phone": "+62 717 123456",
      "rating": 4.4,
      "totalReviews": 250,
      "openHours": "08:00 - 19:00",
      "services": ["Pakan Anjing & Kucing", "Kandang", "Mainan", "Vitamin"],
      "position": [-2.1333, 106.1167],
      "googleMapUrl": "https://www.google.com/maps?q=Pangkal+Pinang+Pet+House"
    },
    {
      "id": 40,
      "name": "Gading Serpong Pet Care",
      "address": "Ruko Dalton, Jl. Gading Serpong Boulevard, Pakulonan Bar., Klp. Dua, Tangerang, Banten",
      "phone": "+62 21 54210000",
      "rating": 4.8,
      "totalReviews": 1600,
      "openHours": "09:00-21:00",
      "services": ["Klinik", "Grooming", "Toko", "Hotel"],
      "position": [-6.2415, 106.6267],
      "googleMapUrl": "https://www.google.com/maps?q=Gading+Serpong+Pet+Care"
    },
    {
      "id": 41,
      "name": "Fauna Land Petshop Sukabumi",
      "address": "Jl. Jend. Sudirman No. 20, Gunungparang, Cikole, Kota Sukabumi, Jawa Barat",
      "phone": "+62 266 221133",
      "rating": 4.5,
      "totalReviews": 400,
      "openHours": "08:00-20:00",
      "services": ["Pakan", "Aksesoris", "Kandang"],
      "position": [-6.9213, 106.9294],
      "googleMapUrl": "https://www.google.com/maps?q=Fauna+Land+Petshop,Sukabumi"
    },
    {
      "id": 42,
      "name": "Purwokerto Pet Center",
      "address": "Jl. Prof. Dr. Suharso No. 9, Arcawinangun, Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah",
      "phone": "+62 281 636363",
      "rating": 4.6,
      "totalReviews": 650,
      "openHours": "09:00-21:00",
      "services": ["Grooming", "Klinik", "Toko"],
      "position": [-7.4208, 109.2559],
      "googleMapUrl": "https://www.google.com/maps?q=Purwokerto+Pet+Center"
    },
    {
      "id": 43,
      "name": "Madiun Pet's Corner",
      "address": "Jl. H. Agus Salim No. 55, Nambangan Lor, Manguharjo, Kota Madiun, Jawa Timur",
      "phone": "+62 351 454545",
      "rating": 4.5,
      "totalReviews": 350,
      "openHours": "08:30-20:30",
      "services": ["Pakan", "Aksesoris", "Grooming"],
      "position": [-7.6277, 111.5222],
      "googleMapUrl": "https://www.google.com/maps?q=Madiun+Pet's+Corner"
    },
    {
      "id": 44,
      "name": "Kediri Pet House",
      "address": "Jl. Brawijaya No. 40, Pocanan, Kec. Kota, Kota Kediri, Jawa Timur",
      "phone": "+62 354 686868",
      "rating": 4.7,
      "totalReviews": 700,
      "openHours": "09:00-21:00",
      "services": ["Grooming", "Klinik", "Pet Hotel", "Toko"],
      "position": [-7.8184, 112.0123],
      "googleMapUrl": "https://www.google.com/maps?q=Kediri+Pet+House"
    },
    {
      "id": 45,
      "name": "Tegal Pet Gallery",
      "address": "Jl. AR. Hakim No. 10, Randugunting, Tegal Sel., Kota Tegal, Jawa Tengah",
      "phone": "+62 283 353535",
      "rating": 4.4,
      "totalReviews": 300,
      "openHours": "09:00-20:00",
      "services": ["Pakan", "Aksesoris"],
      "position": [-6.8778, 109.1255],
      "googleMapUrl": "https://www.google.com/maps?q=Tegal+Pet+Gallery"
    },
    {
      "id": 46,
      "name": "Pekalongan Pet Care",
      "address": "Jl. Hayam Wuruk No. 50, Kauman, Pekalongan Tim., Kota Pekalongan, Jawa Tengah",
      "phone": "+62 285 424242",
      "rating": 4.6,
      "totalReviews": 400,
      "openHours": "08:00-21:00",
      "services": ["Grooming", "Klinik", "Toko"],
      "position": [-6.8879, 109.6738],
      "googleMapUrl": "https://www.google.com/maps?q=Pekalongan+Pet+Care"
    },
    {
      "id": 47,
      "name": "Bengkulu Pet Zone",
      "address": "Jl. S. Parman No. 25, Padang Jati, Ratu Samban, Kota Bengkulu, Bengkulu",
      "phone": "+62 736 23456",
      "rating": 4.5,
      "totalReviews": 320,
      "openHours": "09:00-21:00",
      "services": ["Grooming", "Pakan", "Aksesoris"],
      "position": [-3.7994, 102.2647],
      "googleMapUrl": "https://www.google.com/maps?q=Bengkulu+Pet+Zone"
    },
    {
      "id": 48,
      "name": "Cilegon Pet Station",
      "address": "Jl. Raya Cilegon No. 8, Jombang Wetan, Jombang, Kota Cilegon, Banten",
      "phone": "+62 254 393939",
      "rating": 4.3,
      "totalReviews": 280,
      "openHours": "08:30-20:00",
      "services": ["Pakan", "Aksesoris"],
      "position": [-6.0189, 106.0567],
      "googleMapUrl": "https://www.google.com/maps?q=Cilegon+Pet+Station"
    },
    {
      "id": 49,
      "name": "Karawang Pet World",
      "address": "Jl. Tuparev No. 300, Nagasari, Karawang Bar., Kabupaten Karawang, Jawa Barat",
      "phone": "+62 267 404040",
      "rating": 4.5,
      "totalReviews": 550,
      "openHours": "09:00-21:00",
      "services": ["Grooming", "Toko", "Klinik"],
      "position": [-6.3055, 107.3087],
      "googleMapUrl": "https://www.google.com/maps?q=Karawang+Pet+World"
    },
    {
      "id": 50,
      "name": "Tasikmalaya Pet Paradise",
      "address": "Jl. HZ. Mustofa No. 150, Nagarawangi, Cihideung, Kota Tasikmalaya, Jawa Barat",
      "phone": "+62 265 333222",
      "rating": 4.6,
      "totalReviews": 480,
      "openHours": "08:00-20:00",
      "services": ["Grooming", "Toko", "Pakan"],
      "position": [-7.3248, 108.2238],
      "googleMapUrl": "https://www.google.com/maps?q=Tasikmalaya+Pet+Paradise"
    }
  ]