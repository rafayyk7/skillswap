import { db } from "./index";
import {
  users,
  profiles,
  categories,
  skills,
  languages,
  userTeachingSkills,
  userLearningSkills,
  userLanguages,
  availability,
} from "./schema";
import { hashPassword } from "../lib/api/auth";
import { slugify } from "../lib/utils";

const CATEGORIES_DATA = [
  { name: "Web Development", icon: "💻" },
  { name: "Mobile Apps", icon: "📱" },
  { name: "Graphic Design", icon: "🎨" },
  { name: "UI/UX", icon: "✨" },
  { name: "Video Editing", icon: "🎬" },
  { name: "Digital Marketing", icon: "📈" },
  { name: "SEO", icon: "🔍" },
  { name: "Cooking", icon: "🍳" },
  { name: "Photography", icon: "📷" },
  { name: "Public Speaking", icon: "🎤" },
  { name: "Languages", icon: "🌍" },
  { name: "Music", icon: "🎵" },
  { name: "Fitness", icon: "💪" },
  { name: "AI", icon: "🤖" },
  { name: "Cyber Security", icon: "🔒" },
  { name: "Data Science", icon: "📊" },
  { name: "Business", icon: "💼" },
  { name: "Finance", icon: "💰" },
  { name: "Writing", icon: "✍️" },
  { name: "Programming", icon: "⌨️" },
  { name: "Personal Development", icon: "🌱" },
];

const SKILLS_DATA: Record<string, string[]> = {
  "Web Development": [
    "HTML/CSS",
    "JavaScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Python Web",
    "PHP",
    "Ruby on Rails",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
  ],
  "Mobile Apps": [
    "React Native",
    "Flutter",
    "Swift/iOS",
    "Kotlin/Android",
    "Xamarin",
  ],
  "Graphic Design": [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Canva",
    "Logo Design",
    "Brand Identity",
  ],
  "UI/UX": [
    "User Research",
    "Wireframing",
    "Prototyping",
    "Usability Testing",
    "Design Systems",
  ],
  "Video Editing": [
    "Adobe Premiere Pro",
    "Final Cut Pro",
    "DaVinci Resolve",
    "After Effects",
    "Motion Graphics",
  ],
  "Digital Marketing": [
    "Social Media Marketing",
    "Content Marketing",
    "Email Marketing",
    "PPC Advertising",
    "Analytics",
  ],
  SEO: [
    "On-Page SEO",
    "Off-Page SEO",
    "Technical SEO",
    "Keyword Research",
    "Link Building",
  ],
  Cooking: [
    "Italian Cuisine",
    "Asian Cuisine",
    "Baking",
    "Vegan Cooking",
    "Meal Prep",
  ],
  Photography: [
    "Portrait Photography",
    "Landscape Photography",
    "Product Photography",
    "Photo Editing",
    "Lightroom",
  ],
  "Public Speaking": [
    "Presentation Skills",
    "Storytelling",
    "Voice Training",
    "Debate",
    "Confidence Building",
  ],
  Languages: [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Japanese",
    "Arabic",
    "Portuguese",
  ],
  Music: [
    "Guitar",
    "Piano",
    "Singing",
    "Music Production",
    "Music Theory",
    "Drums",
  ],
  Fitness: [
    "Weight Training",
    "Yoga",
    "Running",
    "CrossFit",
    "Nutrition",
    "Stretching",
  ],
  AI: [
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "ChatGPT/LLMs",
  ],
  "Cyber Security": [
    "Ethical Hacking",
    "Network Security",
    "Cryptography",
    "Security Auditing",
  ],
  "Data Science": [
    "Python for Data",
    "R Programming",
    "SQL",
    "Data Visualization",
    "Statistics",
  ],
  Business: [
    "Entrepreneurship",
    "Project Management",
    "Leadership",
    "Strategy",
    "Negotiation",
  ],
  Finance: [
    "Investing",
    "Accounting",
    "Financial Planning",
    "Cryptocurrency",
    "Stock Trading",
  ],
  Writing: [
    "Creative Writing",
    "Copywriting",
    "Technical Writing",
    "Blogging",
    "Screenwriting",
  ],
  Programming: [
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "SQL",
    "Algorithms",
    "System Design",
  ],
  "Personal Development": [
    "Time Management",
    "Productivity",
    "Mindfulness",
    "Goal Setting",
    "Communication",
  ],
};

const LANGUAGES_DATA = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Mandarin", code: "zh" },
  { name: "Japanese", code: "ja" },
  { name: "Korean", code: "ko" },
  { name: "Arabic", code: "ar" },
  { name: "Portuguese", code: "pt" },
  { name: "Italian", code: "it" },
  { name: "Russian", code: "ru" },
  { name: "Hindi", code: "hi" },
  { name: "Urdu", code: "ur" },
  { name: "Turkish", code: "tr" },
  { name: "Dutch", code: "nl" },
];

const DEMO_USERS = [
  {
    email: "demo@skillswap.local",
    password: "Demo123!",
    username: "demo_user",
    displayName: "Demo User",
    bio: "This is a demo account for testing SkillSwap features.",
    country: "United States",
    timezone: "America/New_York",
    teachingSkills: ["React", "TypeScript"],
    learningSkills: ["Python", "Machine Learning"],
    languages: ["English"],
  },
  {
    email: "sarah@skillswap.local",
    password: "Test123!",
    username: "sarah_designer",
    displayName: "Sarah Johnson",
    bio: "UI/UX Designer with 5 years of experience. Love creating beautiful and functional interfaces.",
    country: "United Kingdom",
    timezone: "Europe/London",
    teachingSkills: ["Figma", "User Research", "Prototyping"],
    learningSkills: ["React", "JavaScript"],
    languages: ["English", "French"],
  },
  {
    email: "alex@skillswap.local",
    password: "Test123!",
    username: "alex_dev",
    displayName: "Alex Chen",
    bio: "Full Stack Developer passionate about building web applications. Always learning new technologies.",
    country: "Canada",
    timezone: "America/Toronto",
    teachingSkills: ["React", "Node.js", "TypeScript", "Next.js"],
    learningSkills: ["Figma", "UI/UX", "User Research"],
    languages: ["English", "Mandarin"],
  },
  {
    email: "ahmed@skillswap.local",
    password: "Test123!",
    username: "ahmed_editor",
    displayName: "Ahmed Hassan",
    bio: "Professional video editor and motion graphics artist. Creating cinematic content for 7 years.",
    country: "Pakistan",
    timezone: "Asia/Karachi",
    teachingSkills: ["Adobe Premiere Pro", "After Effects", "Motion Graphics"],
    learningSkills: ["Photography", "Lightroom"],
    languages: ["English", "Urdu", "Arabic"],
  },
  {
    email: "maria@skillswap.local",
    password: "Test123!",
    username: "maria_market",
    displayName: "Maria Garcia",
    bio: "Digital Marketing Specialist helping businesses grow their online presence.",
    country: "Spain",
    timezone: "Europe/Madrid",
    teachingSkills: ["Social Media Marketing", "SEO", "Content Marketing"],
    learningSkills: ["Copywriting", "Video Editing"],
    languages: ["Spanish", "English", "Portuguese"],
  },
];

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // Seed categories
    console.log("📁 Seeding categories...");
    const categoryMap: Record<string, string> = {};
    
    for (const cat of CATEGORIES_DATA) {
      const [inserted] = await db
        .insert(categories)
        .values({
          name: cat.name,
          slug: slugify(cat.name),
          icon: cat.icon,
        })
        .onConflictDoNothing()
        .returning();
      
      if (inserted) {
        categoryMap[cat.name] = inserted.id;
      }
    }

    // Seed skills
    console.log("🛠️ Seeding skills...");
    const skillMap: Record<string, string> = {};
    
    for (const [categoryName, skillNames] of Object.entries(SKILLS_DATA)) {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) continue;

      for (const skillName of skillNames) {
        const [inserted] = await db
          .insert(skills)
          .values({
            name: skillName,
            slug: slugify(skillName),
            categoryId,
          })
          .onConflictDoNothing()
          .returning();
        
        if (inserted) {
          skillMap[skillName] = inserted.id;
        }
      }
    }

    // Seed languages
    console.log("🌍 Seeding languages...");
    const languageMap: Record<string, string> = {};
    
    for (const lang of LANGUAGES_DATA) {
      const [inserted] = await db
        .insert(languages)
        .values(lang)
        .onConflictDoNothing()
        .returning();
      
      if (inserted) {
        languageMap[lang.name] = inserted.id;
      }
    }

    // Seed demo users
    console.log("👤 Seeding demo users...");
    
    for (const userData of DEMO_USERS) {
      const passwordHash = await hashPassword(userData.password);
      
      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          passwordHash,
          emailVerified: true,
          status: "active",
          role: userData.email === "demo@skillswap.local" ? "admin" : "user",
        })
        .onConflictDoNothing()
        .returning();

      if (!user) continue;

      await db.insert(profiles).values({
        userId: user.id,
        username: userData.username,
        displayName: userData.displayName,
        bio: userData.bio,
        country: userData.country,
        timezone: userData.timezone,
      });

      // Add teaching skills
      for (const skillName of userData.teachingSkills) {
        const skillId = skillMap[skillName];
        if (skillId) {
          await db.insert(userTeachingSkills).values({
            userId: user.id,
            skillId,
            proficiency: "advanced",
            yearsExperience: Math.floor(Math.random() * 5) + 1,
          }).onConflictDoNothing();
        }
      }

      // Add learning skills
      for (const skillName of userData.learningSkills) {
        const skillId = skillMap[skillName];
        if (skillId) {
          await db.insert(userLearningSkills).values({
            userId: user.id,
            skillId,
            desiredLevel: "intermediate",
          }).onConflictDoNothing();
        }
      }

      // Add languages
      for (const langName of userData.languages) {
        const languageId = languageMap[langName];
        if (languageId) {
          await db.insert(userLanguages).values({
            userId: user.id,
            languageId,
            proficiency: langName === userData.languages[0] ? "expert" : "intermediate",
          }).onConflictDoNothing();
        }
      }

      // Add availability
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
      for (const day of days) {
        await db.insert(availability).values({
          userId: user.id,
          dayOfWeek: day,
          startTime: "18:00",
          endTime: "21:00",
          timezone: userData.timezone,
        });
      }
    }

    console.log("✅ Seed completed successfully!");
    console.log("\n📝 Demo credentials:");
    console.log("   Email: demo@skillswap.local");
    console.log("   Password: Demo123!");
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

