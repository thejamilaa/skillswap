import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()

  const seedData = [
    { category: 'Frontend Dasturlash', skills: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'HTML & CSS', 'Tailwind CSS', 'TypeScript', 'JavaScript', 'Redux', 'Zustand'] },
    { category: 'Backend Dasturlash', skills: ['Node.js', 'Express.js', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', 'Laravel', 'Go', 'Rust', 'Ruby on Rails', 'PHP', 'C#', '.NET', 'GraphQL'] },
    { category: 'Fullstack Dasturlash', skills: ['MERN Stack', 'PERN Stack', 'T3 Stack', 'LAMP Stack', 'MEAN Stack'] },
    { category: 'Mobil Dasturlash (Mobile)', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android Development', 'iOS Development', 'Dart', 'Objective-C'] },
    { category: 'UI/UX Dizayn', skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Web Design'] },
    { category: 'Sun\'iy Intellekt (AI) & ML', skills: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Keras', 'NLP', 'Computer Vision', 'Generative AI', 'Prompt Engineering', 'OpenAI API', 'LLM'] },
    { category: 'Data Science (Ma\'lumotlar Ilmi)', skills: ['Python', 'R', 'Pandas', 'NumPy', 'Data Visualization', 'Matplotlib', 'Tableau', 'Power BI', 'SQL', 'Excel'] },
    { category: 'DevOps va Bulutli Texnologiyalar (Cloud)', skills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Microsoft Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Bash Scripting'] },
    { category: 'Ma\'lumotlar Bazasi (Database)', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Firebase', 'Supabase', 'Oracle', 'Elasticsearch'] },
    { category: 'Kiberxavfsizlik (Cybersecurity)', skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Cryptography', 'OWASP', 'Malware Analysis'] },
    { category: 'O\'yin Dasturlash (Game Dev)', skills: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Godot', 'Blender', '3D Modeling'] },
    { category: 'Blokcheyn va Web3', skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'Ethers.js', 'Rust (Solana)', 'DeFi', 'NFT'] },
    { category: 'Data Engineering', skills: ['Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'Snowflake', 'BigQuery', 'ETL'] },
    { category: 'QA va Dasturni Testlash', skills: ['Selenium', 'Cypress', 'Jest', 'Playwright', 'Mocha', 'Manual Testing', 'Automated Testing', 'Postman'] },
    { category: 'Tizim Dasturlash (Systems)', skills: ['C', 'C++', 'Rust', 'Zig', 'Assembly', 'Embedded Systems', 'OS Development'] },
    { category: 'Mahsulot Boshqaruvi (Product)', skills: ['Agile', 'Scrum', 'Jira', 'Roadmap Planning', 'User Stories', 'Product Strategy', 'Kanban'] },
    { category: 'Raqamli Marketing (Digital Marketing)', skills: ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Google Analytics', 'Facebook Ads', 'Email Marketing', 'Targeting'] },
    { category: 'Sotuv va Biznes (Sales)', skills: ['B2B Sales', 'Cold Calling', 'Negotiation', 'CRM', 'Salesforce', 'Business Strategy', 'Entrepreneurship'] },
    { category: 'Grafik Dizayn', skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Logo Design', 'Branding', 'Typography', 'CorelDRAW'] },
    { category: 'Video Montaj va Animatsiya', skills: ['Video Editing', 'Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Motion Graphics'] },
    { category: 'Ovoz va Musiqa (Audio)', skills: ['Music Production', 'FL Studio', 'Ableton Live', 'Podcasting', 'Sound Design', 'Logic Pro'] },
    { category: 'Xorijiy Tillar (Languages)', skills: ['English Speaking', 'IELTS Prep', 'TOEFL Prep', 'Russian Speaking', 'Arabic Speaking', 'Korean Speaking', 'CEFR'] },
    { category: 'Tarjima va Koping (Copywriting)', skills: ['Copywriting', 'Translation', 'Creative Writing', 'Technical Writing', 'SEO Writing'] },
    { category: 'Matematika', skills: ['Calculus', 'Linear Algebra', 'Discrete Math', 'Geometry', 'Algebra'] },
    { category: 'Statistika va Ehtimollar', skills: ['Probability', 'Statistics', 'SPSS', 'Hypothesis Testing'] },
    { category: 'Moliya va Buxgalteriya', skills: ['Financial Modeling', 'Bookkeeping', 'Corporate Finance', '1C Buxgalteriya', 'Tax Planning'] },
    { category: 'Kripto va Investitsiya', skills: ['Crypto Trading', 'Stock Investing', 'Technical Analysis', 'Forex', 'Risk Management'] },
    { category: 'Shaxsiy Rivojlanish', skills: ['Public Speaking', 'Time Management', 'Leadership', 'Emotional Intelligence', 'Career Mentorship', 'Interview Prep'] },
    { category: 'Elektronika va IoT', skills: ['Arduino', 'Raspberry Pi', 'PCB Design', 'IoT', 'Robotics', 'Microcontrollers'] },
    { category: 'AR / VR Texnologiyalari', skills: ['Augmented Reality', 'Virtual Reality', 'Meta Quest', 'ARKit', 'ARCore'] },
    { category: 'Low-Code / No-Code', skills: ['Webflow', 'Bubble', 'Framer', 'Zapier', 'Make', 'Airtable', 'Notion'] },
    { category: 'Kontent Yaratish (Blogging/Vlogging)', skills: ['Blogging', 'Vlogging', 'YouTube Strategy', 'TikTok Growth', 'Photography', 'Script Writing'] },
    { category: 'Arxitektura va Chizmachilik', skills: ['AutoCAD', 'SolidWorks', 'Revit', 'Civil Engineering', 'Mechanical Engineering', '3ds Max'] },
    { category: 'Tibbiyot va Salomatlik', skills: ['First Aid', 'Nutrition', 'Fitness Coaching', 'Mental Health', 'Anatomy'] },
    { category: 'Tabiiy Fanlar', skills: ['Biology', 'Chemistry', 'Physics', 'Geography', 'Astronomy'] },
    { category: 'Inson Resurslari (HR)', skills: ['Recruiting', 'Talent Acquisition', 'HR Strategy', 'Employee Relations', 'Onboarding'] },
    { category: 'Loyihalar Boshqaruvi (Project Management)', skills: ['PMP', 'Prince2', 'Asana', 'Trello', 'Risk Management'] },
    { category: 'Huquqshunoslik (Law)', skills: ['Business Law', 'Intellectual Property', 'Corporate Law', 'Contracts', 'International Law'] },
    { category: 'Logistika va Ta\'minot', skills: ['Supply Chain Management', 'Inventory Management', 'Logistics', 'Procurement'] },
    { category: 'Mijozlarga Xizmat Ko\'rsatish (Customer Service)', skills: ['Client Relations', 'Support Tickets', 'Zendesk', 'Intercom', 'Customer Success'] },
    { category: 'Pazandachilik (Culinary)', skills: ['Baking', 'Cooking', 'Food Plating', 'Pastry', 'Menu Planning'] },
    { category: 'San\'at va Hunarmandchilik', skills: ['Painting', 'Drawing', 'Sculpture', 'Pottery', 'Origami'] },
    { category: 'Moda va Tikuvchilik (Fashion)', skills: ['Fashion Design', 'Sewing', 'Pattern Making', 'Styling', 'Textiles'] },
    { category: 'Sport va Murabbiylik', skills: ['Personal Training', 'Yoga', 'Martial Arts', 'Chess', 'Sports Psychology'] },
    { category: 'Tadbir Tashkil Etish (Event Planning)', skills: ['Wedding Planning', 'Corporate Events', 'Event Management', 'Catering'] },
    { category: 'Biotexnologiya va Bioinformatika', skills: ['Genomics', 'Bioinformatics', 'CRISPR', 'Molecular Biology'] },
    { category: 'Qishloq Xo\'jaligi (Agriculture)', skills: ['Agronomy', 'Hydroponics', 'Sustainable Farming', 'Botany'] },
    { category: 'Jurnalistika va Media', skills: ['Investigative Journalism', 'Broadcasting', 'Press Releases', 'Media Relations'] },
    { category: 'Rivojlanayotgan Texnologiyalar', skills: ['Quantum Computing', 'Nanotechnology', 'Space Tech', 'Autonomous Vehicles'] },
    { category: 'Biznes Tahlil (Business Analysis)', skills: ['Process Mapping', 'Requirements Gathering', 'Data Modeling', 'BPMN'] },
  ]

  const toInsert: { name: string, category: string }[] = []

  seedData.forEach(cat => {
    cat.skills.forEach(skillName => {
      toInsert.push({ name: skillName, category: cat.category })
    })
  })

  // Read existing to avoid duplicate conflicts
  const { data: existing } = await supabase.from('skills').select('name')
  const existingNames = new Set(existing?.map(s => s.name) || [])
  
  const actualInsert = toInsert.filter(s => !existingNames.has(s.name))

  if (actualInsert.length > 0) {
    const { error } = await supabase.from('skills').insert(actualInsert)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ 
    message: 'Seeding completed!', 
    inserted: actualInsert.length,
    totalExistingBefore: existingNames.size 
  })
}
