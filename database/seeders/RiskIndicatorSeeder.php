<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Aspect;
use App\Models\RiskIndicator;

class RiskIndicatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aspects = Aspect::all();

        $sampleIndicators = [
            'Regulasi dan Kelembagaan' => [
                'Regulasi dan kerangka hukum mengenai Design and Build masih kurang komprehensif/kurang detail',
                'Masih banyak terjadi perubahan kebijakan dan/atau regulasi',
                'Pedoman teknis dan prosedur pelaksanaan proyek mengenai Design and Build dibuat oleh Owner belum cukup jelas',
                'Kualitas studi kelayakan (feasibility study) masih rendah sehingga perencanaan proyek menjadi kurang matang.',
            ],
            'Kualitas Persiapan dan Data Dasar Proyek' => [
                'Perencanaan proyek masih terlalu berfokus pada pembangunan infrastruktur fisik tanpa didukung strategi ekonomi jangka Panjang',
                'Pembebasan lahan belum tuntas dan kesiapan lokasi proyek belum sepenuhnya terpenuhi sebelum konstruksi dimulai',
                'Alokasi waktu untuk penyiapan dokumen tender dan/atau penawaran masih belum mencukupi',
            ],
            'Basic Design dan KAK' => [
                'Ruang lingkup proyek dalam Persyaratan Owner (Owner\'s Requirements) masih belum jelas dan/atau belum lengkap',
                'Basic Design yang disediakan oleh Owner masih belum lengkap',
            ],
            'Tender dan Kontrak' => [
                'Kriteria evaluasi dalam proses tender masih belum lengkap dan/atau belum jelas',
                'Persyaratan administrasi tender di luar teknis (seperti jaminan, TKDN, dan jenis SBU) belum tepat atau tidak proporsional',
                'Rendahnya minat Kontraktor Design and Build dalam mengikuti tender berpotensi menyebabkan gagalnya proses tender akibat minimnya jumlah peserta yang memenuhi persyaratan',
                'Dokumen kontrak dan lampiran yang disusun oleh Owner masih belum lengkap serta masih mengandung kesalahan substantif, editorial, numerik, dan/atau alfabetis',
                'Owner termasuk Konsultan MK masih kurang berpengalaman dalam melaksanakan proyek Design and Build',
                'Kontraktor Design and Build masih kurang berpengalaman dalam melaksanakan proyek DB dan/atau proyek sejenis.',
                'Masih terdapat perbedaan persepsi antara Owner dan Kontraktor DB terhadap kriteria kinerja (performance criteria)',
            ],
            'Kompetensi' => [
                'Kemampuan Owner dalam mengevaluasi usulan desain dan inovasi dari Kontraktor DB masih terbatas',
                'Kontraktor DB masih kurang kompeten dalam mengembangkan Basic Design menjadi Detail Engineering Design (DED) yang optimal',
                'Proses review dan persetujuan (approval) desain oleh Owner dan/atau Konsultan MK masih berlangsung lambat',
            ],
            'Desain dan Teknologi' => [
                'Pemanfaatan BIM, Modular, dan IoT belum optimal dalam kolaborasi desain',
                'Sering terjadi perubahan desain/lingkup dari Owner yang memicu addendum (bahkan melebihi 10%) dan menyebabkan keterlambatan proyek konstruksi',
                'Terdapat permintaan perubahan/pekerjaan ulang (rework) dari Owner pada pekerjaan yang sudah selesai',
                'Definisi variation dan prosedur perubahan desain dalam dokumen kontrak masih belum jelas, sehingga memicu konflik atau klaim dalam interpretasi kontrak Lump Sum Fixed Price ketika terjadi perubahan',
            ],
            'Perubahan' => [
                'Perhitungan pagu anggaran (HPS/OE) oleh Owner masih belum akurat',
                'Pendanaan dan pembiayaan proyek sangat bergantung pada APBN karena minimnya dukungan/partisipasi KPS/PPP (Sektor Swasta)',
                'Dukungan cash flow dari Owner masih belum memadai, baik karena besaran uang muka rendah (<30% / <20%) maupun keterlambatan pembayaran termin kepada Kontraktor DB',
                'Kendala pada rantai pasok (supply chain) seperti kelangkaan material dan alat, fluktuasi harga material dan alat (inflasi), atau keterlambatan pengiriman masih sering terjadi',
            ],
            'Finansial' => [
                'Ketersediaan tenaga kerja terampil yang menguasai metode konstruksi modern dan teknologi spesifik proyek',
                'Area penyimpanan material dan akses logistik di lokasi proyek yang masih terbatas',
                'Penyusunan jadwal pelaksanaan oleh Kontraktor masih belum akurat',
                'Koordinasi dan komunikasi antara Owner, Kontraktor, dan pihak terkait masih belum berjalan dengan baik, sehingga pengambilan keputusan oleh Owner sering terlambat',
                'Proses pengawasan konstruksi dan inspeksi fisik di lapangan kurang efektif atau sering terlambat',
                'Pelaksanaan proyek masih sering terganggu oleh faktor eksternal, seperti cuaca ekstrem, hujan berkepanjangan, atau bencana alam',
                'Menemukan kondisi geoteknik/tanah yang tidak terduga saat pelaksanaan konstruksi',
                'Terjadinya kecelakaan kerja atau masalah kesehatan/penyakit menular di lokasi proyek',
                'Tanggung jawab pemeliharaan antara Owner dan Kontraktor masih belum jelas',
                'Dokumen as-built drawing masih belum lengkap dan/atau belum sesuai dengan kondisi lapangan',
                'Proses audit oleh BPK/BPKP pada proyek Design and Build masih mengalami kesulitan karena perbedaan standar audit antara kontrak lump sum dan unit price',
            ],
        ];

        foreach ($aspects as $aspect) {
            $indicators = $sampleIndicators[$aspect->name] ?? ['Sample Risk Indicator for ' . $aspect->name];
            foreach ($indicators as $index => $text) {
                RiskIndicator::create([
                    'aspect_id' => $aspect->id,
                    'indicator_text' => $text,
                    'order' => $index + 1,
                ]);
            }
        }
    }
}