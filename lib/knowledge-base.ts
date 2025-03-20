// Simulated knowledge base for different topics
// In a real application, this would be replaced with actual API calls to search engines or knowledge bases

export interface KnowledgeEntry {
  topic: string
  source: string
  content: string
  url?: string
  date?: string
}

export const knowledgeBase: KnowledgeEntry[] = [
  // Productivity
  {
    topic: "productivity",
    source: "Harvard Business Review",
    content:
      "Research shows that the most productive people work in focused sprints of 52 minutes followed by 17-minute breaks. This approach maximizes concentration while preventing burnout.",
    url: "https://hbr.org/2019/03/productivity-methods",
    date: "2023-05-15",
  },
  {
    topic: "productivity",
    source: "Journal of Applied Psychology",
    content:
      "A study found that workers who used time-blocking techniques increased their productivity by 18% compared to those who didn't structure their workday.",
    url: "https://www.apa.org/pubs/journals/apl",
    date: "2022-11-03",
  },
  {
    topic: "productivity",
    source: "The Pomodoro Technique",
    content:
      "The Pomodoro Technique involves working for 25 minutes, then taking a 5-minute break. After four cycles, take a longer 15-30 minute break. This method helps maintain focus and prevents mental fatigue.",
    url: "https://francescocirillo.com/pages/pomodoro-technique",
    date: "2023-01-22",
  },
  {
    topic: "productivity",
    source: "Nature Journal",
    content:
      "Recent neuroscience research indicates that our brains operate in two modes: focused mode and diffuse mode. Alternating between these modes enhances problem-solving and creativity.",
    url: "https://www.nature.com/articles/s41593-022-1022-x",
    date: "2023-08-10",
  },
  {
    topic: "productivity",
    source: "MIT Technology Review",
    content:
      "A 2023 study found that digital minimalism—intentionally reducing technology use—led to a 34% increase in deep work productivity among knowledge workers.",
    url: "https://www.technologyreview.com/2023/04/15/digital-minimalism",
    date: "2023-04-15",
  },

  // Time Management
  {
    topic: "time management",
    source: "Time Management for System Administrators",
    content:
      "The Eisenhower Matrix categorizes tasks by urgency and importance: 1) Urgent & Important: Do immediately, 2) Important but Not Urgent: Schedule time, 3) Urgent but Not Important: Delegate, 4) Neither Urgent nor Important: Eliminate.",
    url: "https://www.oreilly.com/library/view/time-management-for/0596007833/",
    date: "2022-06-18",
  },
  {
    topic: "time management",
    source: "Getting Things Done",
    content:
      "David Allen's GTD method involves five steps: capture, clarify, organize, reflect, and engage. This system helps process incoming tasks efficiently and maintain a clear mind.",
    url: "https://gettingthingsdone.com/",
    date: "2023-02-05",
  },
  {
    topic: "time management",
    source: "Journal of Organizational Behavior",
    content:
      "A longitudinal study published in 2023 found that individuals who practice time-blocking—assigning specific time slots for different activities—reported 23% higher task completion rates and 31% lower stress levels.",
    url: "https://onlinelibrary.wiley.com/journal/10991379",
    date: "2023-07-12",
  },
  {
    topic: "time management",
    source: "Stanford University Research",
    content:
      "The '2-minute rule' states that if a task takes less than 2 minutes to complete, you should do it immediately rather than scheduling it for later. This prevents small tasks from accumulating and becoming overwhelming.",
    url: "https://stanford.edu/research/productivity-studies",
    date: "2023-03-28",
  },

  // Focus
  {
    topic: "focus",
    source: "Deep Work by Cal Newport",
    content:
      "Deep work is the ability to focus without distraction on a cognitively demanding task. To develop this skill, schedule deep work blocks, embrace boredom, quit social media, and drain the shallows of your day.",
    url: "https://www.calnewport.com/books/deep-work/",
    date: "2022-09-14",
  },
  {
    topic: "focus",
    source: "Neuroscience Journal",
    content:
      "Studies show that it takes an average of 23 minutes to fully regain focus after being interrupted. Minimizing distractions is crucial for maintaining productivity.",
    url: "https://www.sciencedirect.com/journal/neuroscience",
    date: "2023-01-30",
  },
  {
    topic: "focus",
    source: "University of California Research",
    content:
      "A 2023 study found that exposure to nature for just 20 minutes can significantly improve concentration and attention span. Taking short walks in natural settings between work sessions can boost cognitive performance.",
    url: "https://www.universityofcalifornia.edu/news/how-nature-improves-focus",
    date: "2023-06-22",
  },
  {
    topic: "focus",
    source: "Frontiers in Psychology",
    content:
      "Recent research indicates that background noise at approximately 70 decibels (similar to a coffee shop ambiance) can enhance creative thinking and focus for many individuals, while complete silence is often better for tasks requiring intense concentration.",
    url: "https://www.frontiersin.org/journals/psychology",
    date: "2023-05-03",
  },

  // To-Do Lists
  {
    topic: "todo list",
    source: "Productivity Research Institute",
    content:
      "Effective to-do lists should be limited to 3-5 important tasks per day. Longer lists can lead to decision fatigue and reduced completion rates.",
    url: "https://productivityresearch.org/todo-lists",
    date: "2022-12-08",
  },
  {
    topic: "todo list",
    source: "Journal of Personality and Social Psychology",
    content:
      "The Zeigarnik Effect shows that uncompleted tasks create mental tension that remains until the task is done. Writing tasks down on a to-do list can help release this tension.",
    url: "https://www.apa.org/pubs/journals/psp",
    date: "2023-02-17",
  },
  {
    topic: "todo list",
    source: "Harvard Business School",
    content:
      "A 2023 study found that people who write their to-do lists the night before are 42% more likely to complete them than those who create lists in the morning, due to reduced decision fatigue and better subconscious processing during sleep.",
    url: "https://hbswk.hbs.edu/item/the-science-of-to-do-lists",
    date: "2023-04-05",
  },
  {
    topic: "todo list",
    source: "Psychological Science",
    content:
      "Research published in 2023 shows that adding specific implementation intentions to to-do items (when, where, and how you'll complete them) increases completion rates by up to 70% compared to simple task descriptions.",
    url: "https://journals.sagepub.com/home/pss",
    date: "2023-08-02",
  },

  // Goal Setting
  {
    topic: "goal setting",
    source: "Psychological Bulletin",
    content:
      "Research on goal setting theory shows that specific, challenging goals lead to higher performance than easy or vague goals like 'do your best'.",
    url: "https://www.apa.org/pubs/journals/bul",
    date: "2022-10-25",
  },
  {
    topic: "goal setting",
    source: "American Psychological Association",
    content:
      "The SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound) has been shown to increase goal achievement rates by up to 70% compared to unstructured goals.",
    url: "https://www.apa.org/topics/goal-setting",
    date: "2023-03-11",
  },
  {
    topic: "goal setting",
    source: "Journal of Applied Psychology",
    content:
      "A 2023 meta-analysis found that individuals who practice visualization techniques alongside concrete goal setting are 45% more likely to achieve their objectives than those who only set goals without mental rehearsal.",
    url: "https://www.apa.org/pubs/journals/apl",
    date: "2023-07-19",
  },
  {
    topic: "goal setting",
    source: "University of Pennsylvania",
    content:
      "Research from positive psychology indicates that setting approach-oriented goals (moving toward something positive) rather than avoidance-oriented goals (moving away from something negative) leads to greater persistence and higher success rates.",
    url: "https://ppc.sas.upenn.edu/research/goal-setting",
    date: "2023-05-28",
  },

  // Calendar Management
  {
    topic: "calendar",
    source: "Harvard Business School",
    content:
      "Time-blocking your calendar for specific activities rather than just meetings can increase productivity by 150%. Reserve time for deep work, administrative tasks, and breaks.",
    url: "https://hbr.org/topic/time-management",
    date: "2022-11-19",
  },
  {
    topic: "calendar",
    source: "Productivity Magazine",
    content:
      "The 'meeting audit' technique involves reviewing all recurring meetings and eliminating those that don't provide clear value. This can reclaim up to 30% of scheduled time for most professionals.",
    url: "https://productivitymagazine.com/meeting-audit",
    date: "2023-01-08",
  },
  {
    topic: "calendar",
    source: "Microsoft Workplace Analytics",
    content:
      "A 2023 study of over 10,000 knowledge workers found that implementing 'no-meeting days' once per week increased employee productivity by 26% and reduced stress levels by 33%.",
    url: "https://www.microsoft.com/en-us/microsoft-365/business-insights-ideas",
    date: "2023-06-14",
  },
  {
    topic: "calendar",
    source: "Journal of Occupational Health Psychology",
    content:
      "Research published in 2023 shows that scheduling 'buffer time' between meetings (at least 10-15 minutes) improves cognitive performance in subsequent meetings by 22% and reduces feelings of burnout.",
    url: "https://www.apa.org/pubs/journals/ocp",
    date: "2023-04-30",
  },

  // Health and Productivity
  {
    topic: "health productivity",
    source: "Journal of Occupational Health Psychology",
    content:
      "Regular exercise has been shown to increase energy levels and productivity by up to 21%. Even short 10-minute walks can boost cognitive function and creativity.",
    url: "https://www.apa.org/pubs/journals/ocp",
    date: "2022-08-05",
  },
  {
    topic: "health productivity",
    source: "Sleep Foundation",
    content:
      "Sleep deprivation significantly impairs cognitive function. Studies show that getting less than 6 hours of sleep reduces attention, working memory, and decision-making abilities by 30%.",
    url: "https://www.sleepfoundation.org/",
    date: "2023-02-28",
  },
  {
    topic: "health productivity",
    source: "American Journal of Clinical Nutrition",
    content:
      "A 2023 study found that maintaining proper hydration (drinking at least 2 liters of water daily) improved cognitive performance by 14% and reaction time by 8% compared to mild dehydration.",
    url: "https://academic.oup.com/ajcn",
    date: "2023-07-05",
  },
  {
    topic: "health productivity",
    source: "International Journal of Workplace Health Management",
    content:
      "Research published in 2023 indicates that employees who take regular microbreaks (3-5 minutes every hour) maintain higher levels of productivity throughout the day compared to those who work for extended periods without breaks.",
    url: "https://www.emerald.com/insight/publication/issn/1753-8351",
    date: "2023-03-17",
  },

  // Mindfulness
  {
    topic: "mindfulness",
    source: "Mindfulness Research Journal",
    content:
      "Regular mindfulness meditation practice has been shown to reduce stress by 31% and improve focus by 16%. Just 10 minutes daily can produce measurable benefits.",
    url: "https://link.springer.com/journal/12671",
    date: "2022-09-22",
  },
  {
    topic: "mindfulness",
    source: "Neuroscience & Biobehavioral Reviews",
    content:
      "Mindfulness practices physically change brain structure, increasing gray matter in regions associated with learning, memory, and emotional regulation.",
    url: "https://www.sciencedirect.com/journal/neuroscience-and-biobehavioral-reviews",
    date: "2023-01-15",
  },
  {
    topic: "mindfulness",
    source: "Journal of Management",
    content:
      "A 2023 study of corporate mindfulness programs found that employees who practiced mindfulness for 8 weeks showed a 28% increase in task focus, 31% reduction in multitasking behaviors, and 22% improvement in job satisfaction.",
    url: "https://journals.sagepub.com/home/jom",
    date: "2023-05-11",
  },
  {
    topic: "mindfulness",
    source: "Frontiers in Human Neuroscience",
    content:
      "Recent research using fMRI scans shows that even brief mindfulness practices (5 minutes) can activate the prefrontal cortex and reduce activity in the amygdala, improving executive function and reducing emotional reactivity.",
    url: "https://www.frontiersin.org/journals/human-neuroscience",
    date: "2023-08-07",
  },
]

// Function to search the knowledge base for relevant information
export function searchKnowledge(query: string, limit = 3): KnowledgeEntry[] {
  const lowerQuery = query.toLowerCase()
  const results: KnowledgeEntry[] = []

  // Split query into keywords
  const keywords = lowerQuery.split(/\s+/).filter((word) => word.length > 3)

  // Score each entry based on keyword matches
  const scoredEntries = knowledgeBase.map((entry) => {
    let score = 0
    const lowerContent = entry.content.toLowerCase()
    const lowerTopic = entry.topic.toLowerCase()
    const lowerSource = entry.source.toLowerCase()

    // Check for topic matches (weighted higher)
    keywords.forEach((keyword) => {
      if (lowerTopic.includes(keyword)) {
        score += 5
      }

      // Check for source matches
      if (lowerSource.includes(keyword)) {
        score += 3
      }

      // Check for content matches
      if (lowerContent.includes(keyword)) {
        score += 2
      }

      // Bonus for exact phrase matches
      if (lowerContent.includes(lowerQuery)) {
        score += 10
      }

      // Bonus for recent entries
      if (entry.date && new Date(entry.date) > new Date("2023-01-01")) {
        score += 2
      }
    })

    return { entry, score }
  })

  // Sort by score and get top results
  const topResults = scoredEntries
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry)

  // If we don't have enough results, simulate a real-time internet search
  if (topResults.length < limit) {
    // Generate a simulated search result
    const simulatedResult: KnowledgeEntry = {
      topic: keywords.join(" "),
      source: "Latest Research (2023)",
      content: generateSimulatedContent(query),
      url: "https://research-database.org/latest-findings",
      date: new Date().toISOString().split("T")[0],
    }

    topResults.push(simulatedResult)
  }

  return topResults
}

// Function to generate simulated content for queries not in the knowledge base
function generateSimulatedContent(query: string): string {
  const lowerQuery = query.toLowerCase()

  // Generate different responses based on query keywords
  if (lowerQuery.includes("productivity") && lowerQuery.includes("technology")) {
    return "Recent studies show that digital productivity tools can increase efficiency by 37%, but only when users receive proper training and establish clear usage guidelines. The most effective approach combines digital tools with analog methods like paper note-taking for important concepts."
  } else if (lowerQuery.includes("focus") && lowerQuery.includes("work from home")) {
    return "A 2023 global survey of remote workers found that those who establish dedicated workspaces, maintain regular hours, and use visual signals to indicate 'focus time' to household members report 41% fewer distractions and 27% higher productivity."
  } else if (lowerQuery.includes("morning routine") || lowerQuery.includes("morning habits")) {
    return "Analysis of high-performers across industries reveals that 89% have consistent morning routines. The most impactful elements include hydration within 30 minutes of waking, 10-15 minutes of movement, and completing one important task before checking emails or messages."
  } else if (lowerQuery.includes("burnout") || lowerQuery.includes("stress management")) {
    return "The latest research on burnout prevention emphasizes the importance of 'recovery periods' throughout the workday. Implementing three 10-minute breaks with complete disconnection from work-related stimuli has been shown to reduce burnout markers by 32%."
  } else {
    // Generic response for other queries
    return "Recent studies in this area highlight the importance of personalized approaches based on individual working styles, chronotypes, and specific job demands. The most effective strategies combine evidence-based techniques with customization for personal preferences and circumstances."
  }
}

