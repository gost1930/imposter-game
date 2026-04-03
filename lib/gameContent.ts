export interface WordPair {
  word: string;
  category: string;
}

export const WORD_PAIRS: WordPair[] = [
  // أدوات
  { word: 'ملعقة', category: 'أدوات' },
  { word: 'شوكة', category: 'أدوات' },
  { word: 'سكين', category: 'أدوات' },
  { word: 'طبق', category: 'أدوات' },
  { word: 'كأس', category: 'أدوات' },
  { word: 'صحن', category: 'أدوات' },
  { word: 'فنجان', category: 'أدوات' },
  { word: 'قدر', category: 'أدوات' },
  
  // فاكهة
  { word: 'موز', category: 'فاكهة' },
  { word: 'تفاح', category: 'فاكهة' },
  { word: 'برتقال', category: 'فاكهة' },
  { word: 'عنب', category: 'فاكهة' },
  { word: 'رمان', category: 'فاكهة' },
  { word: 'إجاص', category: 'فاكهة' },
  { word: 'شمام', category: 'فاكهة' },
  { word: 'كيوي', category: 'فاكهة' },
  
  // حيوانات
  { word: 'أسد', category: 'حيوانات' },
  { word: 'قط', category: 'حيوانات' },
  { word: 'كلب', category: 'حيوانات' },
  { word: 'فيل', category: 'حيوانات' },
  { word: 'حمار', category: 'حيوانات' },
  { word: 'ديك', category: 'حيوانات' },
  { word: 'ثعلب', category: 'حيوانات' },
  { word: 'ببغاء', category: 'حيوانات' },
  
  // رمضان
  { word: 'فانوس', category: 'رمضان' },
  { word: 'تمر', category: 'رمضان' },
  { word: 'حلويات', category: 'رمضان' },
  { word: 'سحور', category: 'رمضان' },
  { word: 'إفطار', category: 'رمضان' },
  { word: 'قرآن', category: 'رمضان' },
  { word: 'دعاء', category: 'رمضان' },
  
  // أشياء يومية
  { word: 'هاتف', category: 'يومي' },
  { word: 'كرسي', category: 'يومي' },
  { word: 'باب', category: 'يومي' },
  { word: 'نافذة', category: 'يومي' },
  { word: 'مرآة', category: 'يومي' },
  { word: 'سرير', category: 'يومي' },
  { word: 'مصباح', category: 'يومي' },
  { word: 'سجادة', category: 'يومي' },
];

export const PUNISHMENTS = [
  'اغسل قدم أحد الموجودين',
  'قول نكتة مضحكة بصوت عالي',
  'اقعد على الأرض وارفع رجليك لمدة دقيقة',
  'قول أغنية شهيرة بنص صوتك',
  'اصنع وجهاً مضحكاً طول ما الجميع يضحكون',
  'اسحب شعرك وقول آخ بصوت عالي',
  'امشي بعكس الاتجاه في الغرفة',
  'قول كلمة صعبة 10 مرات بسرعة',
  'قف على رجل واحدة لمدة 30 ثانية',
  'تحدث بصوت غريب لمدة دقيقة',
  'ارقص على أغنية يختارها الآخرون',
  'اشرب ماء من دون استخدام يديك',
  'قل شيء لا تشعر به بصوت عالي',
  'اقض 2 دقيقة بدون التحدث',
];
