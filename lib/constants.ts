import type { NavItem, Stat, ProcessStep } from '@/types'

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201000000000'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picassomasr.com'

// ─── Navigation ───────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { label_ar: 'الرئيسية',  label_en: 'Home',     href: '/' },
  { label_ar: 'أعمالنا',   label_en: 'Our Work',  href: '/products' },
  { label_ar: 'قصتنا',     label_en: 'Our Story', href: '/about' },
  { label_ar: 'اطلب دلوقتي', label_en: 'Order Now', href: '/order' },
]

// ─── Stats ────────────────────────────────────────────
export const STATS: Stat[] = [
  { value: 500,  suffix: '+',  label_ar: 'قناع اتسلّم',        label_en: 'Pieces Delivered' },
  { value: 5,    suffix: '',   label_ar: 'سنين خبرة',           label_en: 'Years of Craft' },
  { value: 48,   suffix: 'h', label_ar: 'ساعة متوسط التنفيذ', label_en: 'Avg Lead Time' },
  { value: 100,  suffix: '%',  label_ar: 'رضا العملاء',         label_en: 'Client Satisfaction' },
]

// ─── Process Steps ────────────────────────────────────
export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '٠١',
    icon: '💬',
    title_ar: 'الفكرة والتصميم',
    title_en: 'Idea & Design',
    desc_ar: 'بنتكلم معاك وبنفهم تصورك بالظبط — حتى لو مجرد فكرة في دماغك',
    desc_en: 'We discuss your vision in detail — even if it\'s just an idea',
  },
  {
    number: '٠٢',
    icon: '🖨️',
    title_ar: 'الطباعة الثلاثية الأبعاد',
    title_en: '3D Printing',
    desc_ar: 'طابعات دقيقة بريزن فاخر عالي الجودة — لأدق التفاصيل',
    desc_en: 'High-precision resin printing for ultra-fine details',
  },
  {
    number: '٠٣',
    icon: '🎨',
    title_ar: 'التشطيب والتلوين اليدوي',
    title_en: 'Hand-Finish & Paint',
    desc_ar: 'فنانين مصريين محترفين بيضفوا الروح على كل قطعة بريشتهم',
    desc_en: 'Egyptian artists breathe life into every piece by hand',
  },
  {
    number: '٠٤',
    icon: '📦',
    title_ar: 'التغليف والتوصيل',
    title_en: 'Pack & Deliver',
    desc_ar: 'تغليف فاخر وتوصيل آمن لباب بيتك في أي مكان في مصر',
    desc_en: 'Luxury packaging and safe delivery anywhere in Egypt',
  },
]

// ─── Product Categories ───────────────────────────────
export const PRODUCT_CATEGORIES = [
  { value: 'all',    label_ar: 'الكل',      label_en: 'All' },
  { value: 'helmet', label_ar: 'خوذات',     label_en: 'Helmets' },
  { value: 'mask',   label_ar: 'أقنعة',     label_en: 'Masks' },
  { value: 'armor',  label_ar: 'دروع',       label_en: 'Armor' },
  { value: 'custom', label_ar: 'مخصص',      label_en: 'Custom' },
]

// ─── Order Statuses ───────────────────────────────────
export const ORDER_STATUSES = [
  { value: 'new',         label_ar: 'جديد',           label_en: 'New',         color: 'status-new' },
  { value: 'contacted',   label_ar: 'تم التواصل',    label_en: 'Contacted',   color: 'status-contacted' },
  { value: 'confirmed',   label_ar: 'مؤكد',           label_en: 'Confirmed',   color: 'status-confirmed' },
  { value: 'in_progress', label_ar: 'جاري التنفيذ',  label_en: 'In Progress', color: 'status-in_progress' },
  { value: 'ready',       label_ar: 'جاهز للشحن',    label_en: 'Ready',       color: 'status-ready' },
  { value: 'shipped',     label_ar: 'تم الشحن',       label_en: 'Shipped',     color: 'status-shipped' },
  { value: 'delivered',   label_ar: 'تم التوصيل',    label_en: 'Delivered',   color: 'status-delivered' },
  { value: 'cancelled',   label_ar: 'ملغي',           label_en: 'Cancelled',   color: 'status-cancelled' },
]

// ─── Egyptian Cities ──────────────────────────────────
export const EGYPTIAN_CITIES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
  'القليوبية', 'كفر الشيخ', 'الغربية', 'المنوفية', 'البحيرة',
  'الإسماعيلية', 'بور سعيد', 'السويس', 'دمياط', 'الفيوم',
  'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا',
  'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
  'مطروح', 'شمال سيناء', 'جنوب سيناء',
]

// ─── Seed Products ────────────────────────────────────
export const SEED_PRODUCTS = [
  {
    slug: 'optimus-prime-helmet',
    name_ar: 'خوذة أوبتيموس برايم',
    name_en: 'Optimus Prime Helmet',
    description_ar: 'خوذة ويرابل بعيون LED حمراء متوهجة. دقة سينمائية 100٪ من فيلم Transformers. مصنوعة من ريزن فاخر بتشطيب معدني احترافي.',
    description_en: 'Wearable helmet with glowing red LED eyes. Cinema-accurate from the Transformers films. Premium resin with professional metallic finish.',
    price: 2800,
    category: 'helmet',
    character: 'Optimus Prime',
    franchise: 'Transformers',
    has_led: true,
    is_featured: true,
    is_new: false,
  },
  {
    slug: 'deadpool-mask',
    name_ar: 'قناع ديدبول',
    name_en: 'Deadpool Mask',
    description_ar: 'عيون بيضاء متحركة ومرنة، راحة كاملة في الارتداء. تفاصيل الخياطة دقيقة جداً بتشطيب يدوي احترافي.',
    description_en: 'Flexible white eye lenses with full comfort for wear. Ultra-detailed stitching pattern with professional hand-finish.',
    price: 1200,
    category: 'mask',
    character: 'Deadpool',
    franchise: 'Marvel',
    has_led: false,
    is_featured: true,
    is_new: true,
  },
  {
    slug: 'oni-demon-mask',
    name_ar: 'قناع الأوني — شيطان اليابان',
    name_en: 'Oni Demon Mask',
    description_ar: 'تصميم ياباني أصيل بقرون ذهبية وألوان نارية. متاح بألوان متعددة حسب طلبك.',
    description_en: 'Authentic Japanese design with gold horns and fiery colors. Available in multiple color variants on request.',
    price: 950,
    category: 'mask',
    character: 'Oni',
    franchise: 'Japanese Mythology',
    has_led: false,
    is_featured: true,
    is_new: false,
  },
  {
    slug: 'sauron-dark-lord-helmet',
    name_ar: 'خوذة سارون الظلام',
    name_en: 'Dark Lord Sauron Helmet',
    description_ar: 'أسطورة الشر من Lord of the Rings بأدق تفاصيلها. خوذة قابلة للارتداء بنقوش ذهبية وفتحة عين حمراء متوهجة.',
    description_en: 'The Dark Lord from LOTR in full detail. Wearable helmet with gold engravings and a glowing red eye slit.',
    price: 3200,
    category: 'helmet',
    character: 'Sauron',
    franchise: 'Lord of the Rings',
    has_led: true,
    is_featured: true,
    is_new: false,
  },
  {
    slug: 'halo-spartan-helmet-custom',
    name_ar: 'خوذة هالو سبارتان — مخصصة',
    name_en: 'Halo Spartan Helmet (Custom)',
    description_ar: 'مخصص بالكامل حسب طلبك — اختار اللون والتصميم والكتابة. دقة عالية من لعبة Halo.',
    description_en: 'Fully customized to your spec — choose color, design and inscriptions. High-fidelity accuracy from the Halo game.',
    price: null,
    category: 'custom',
    character: 'Spartan',
    franchise: 'Halo',
    has_led: false,
    is_featured: false,
    is_new: true,
  },
  {
    slug: 'wolverine-cowl',
    name_ar: 'قناع ووفيرين',
    name_en: 'Wolverine Cowl',
    description_ar: 'الأذان المميزة بتشطيب معدني احترافي. ريزن فاخر بألوان دقيقة تحاكي الكوميكس والأفلام.',
    description_en: 'Iconic ears with professional metallic finish. Premium resin with accurate colors matching comics and films.',
    price: 1400,
    category: 'mask',
    character: 'Wolverine',
    franchise: 'Marvel',
    has_led: false,
    is_featured: false,
    is_new: false,
  },
]

// ─── Seed Testimonials ────────────────────────────────
export const SEED_TESTIMONIALS = [
  {
    name: 'أحمد ط.',
    city: 'القاهرة',
    content_ar: 'القناع وصلني والتشطيب فيه ماشفتوش في أي مكان تاني. الفنان اللي لوّن عليه ده بجد بيعرف يشتغل.',
    content_en: 'The mask arrived and the finish on it I have never seen anywhere else. The artist who painted it really knows what he is doing.',
    rating: 5,
  },
  {
    name: 'مريم س.',
    city: 'الإسكندرية',
    content_ar: 'طلبت custom mask لشخصية أنيمي نادرة، عملوها من الصورة بالظبط. صح من أول وهلة.',
    content_en: 'I ordered a custom mask for a rare anime character, they made it exactly from the reference image. Perfect on first try.',
    rating: 5,
  },
  {
    name: 'Karim M.',
    city: 'Cairo',
    content_ar: 'لبسته في Cairo Comic Con واتوقفت عشان التصوير كل خمس دقايق. يستاهل كل قرش.',
    content_en: 'Wore this at Cairo Comic Con — got stopped for photos every 5 minutes. Worth every penny.',
    rating: 5,
  },
  {
    name: 'نورهان أ.',
    city: 'الجيزة',
    content_ar: 'التوصيل جه في الموعد والتغليف كان محترم جداً. هطلب تاني بالتأكيد.',
    content_en: 'Delivery arrived on time and the packaging was very professional. Will definitely order again.',
    rating: 5,
  },
]
