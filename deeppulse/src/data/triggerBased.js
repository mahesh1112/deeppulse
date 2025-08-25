// dummyData.js

export const kpiData = {
  Overall: {
    Overall: [
      { title: "Satisfaction Rate", value: "78%" },
      { title: "Engagement Score", value: "7.5/10" },
      { title: "Leadership support", value: "12%" },
      { title: "Avg Feedback Score", value: "4.2/5" },
    ],
    "3 months": [
      { title: "Satisfaction Rate", value: "65%" },
      { title: "Engagement Score", value: "6.5/10" },
      { title: "Leadership support", value: "18%" },
      { title: "Avg Feedback Score", value: "4.2/5" },
    ],
    "6 months": [
      { title: "Satisfaction Rate", value: "70%" },
      { title: "Engagement Score", value: "8.5/10" },
      { title: "Leadership support", value: "22%" },
      { title: "Avg Feedback Score", value: "4.2/5" },
    ],
    "12 months": [
      { title: "Satisfaction Rate", value: "78%" },
      { title: "Engagement Score", value: "7.5/10" },
      { title: "Leadership support", value: "12%" },
      { title: "Avg Feedback Score", value: "4.2/5" },
    ],
  },

  "Role Change": {
    Overall: [
      { title: "Satisfaction Rate", value: "76%" },
      { title: "Role Clarity", value: "4.1/5" },
      { title: "Support", value: "4.1/5" },
      { title: "Workload & Priorities", value: "76%" },
    ],
    "3 months": [
      { title: "Satisfaction Rate", value: "74%" },
      { title: "Role Clarity", value: "3.1/5" },
      { title: "Support", value: "3.1/5" },
      { title: "Workload & Priorities", value: "72%" },
    ],
    "6 months": [
      { title: "Satisfaction Rate", value: "79%" },
      { title: "Role Clarity", value: "4.1/5" },
      { title: "Support", value: "3.1/5" },
      { title: "Workload & Priorities", value: "86%" },
    ],
    "12 months": [
      { title: "Satisfaction Rate", value: "76%" },
      { title: "Role Clarity", value: "4.1/5" },
      { title: "Support", value: "4.1/5" },
      { title: "Workload & Priorities", value: "76%" },
    ],
  },

  "Manager Change": {
    Overall: [
      { title: "Engagement Score", value: "7.0/10" },
      { title: "Leadership Support", value: "15%" },
      { title: "Relationship Rating", value: "4.0/5" },
      { title: "Workload & Priorities", value: "74%" },
    ],
    "3 months": [
      { title: "Engagement Score", value: "8.0/10" },
      { title: "Leadership Support", value: "25%" },
      { title: "Relationship Rating", value: "4.0/5" },
      { title: "Workload & Priorities", value: "84%" },
    ],
    "6 months": [
      { title: "Engagement Score", value: "7.5/10" },
      { title: "Leadership Support", value: "18%" },
      { title: "Relationship Rating", value: "4.0/5" },
      { title: "Workload & Priorities", value: "74%" },
    ],
    "12 months": [
      { title: "Engagement Score", value: "7.0/10" },
      { title: "Leadership Support", value: "45%" },
      { title: "Relationship Rating", value: "4.0/5" },
      { title: "Workload & Priorities", value: "64%" },
    ],
  },

  Promotion: {
    Overall: [
      { title: "Satisfaction Rate", value: "90%" },
      { title: "Avg Feedback Score", value: "4.6/5" },
      { title: "Workload & Priorities", value: "8.1/10" },
    ],
    "3 months": [
      { title: "Satisfaction Rate", value: "90%" },
      { title: "Avg Feedback Score", value: "4.6/5" },
      { title: "Workload & Priorities", value: "8.1/10" },
    ],
    "6 months": [
      { title: "Satisfaction Rate", value: "91%" },
      { title: "Avg Feedback Score", value: "4.6/5" },
      { title: "Workload & Priorities", value: "8.2/10" },
    ],
    "12 months": [
      { title: "Satisfaction Rate", value: "89%" },
      { title: "Avg Feedback Score", value: "4.6/5" },
      { title: "Workload & Priorities", value: "8.0/10" },
    ],
  },
};

// 🔹 Insights now only depend on Trigger, not time period
export const insightsData = {
  Overall: [
    "Employees promoted recently show higher satisfaction.",
    "Manager change feedback indicates communication issues.",
    "Role change employees request better onboarding support.",
  ],

  "Role Change": [
    "Training programs need more hands-on sessions.",
    "Employees appreciate role-specific onboarding.",
  ],

  "Manager Change": [
    "Communication gaps noted after manager changes.",
    "Feedback channels need improvement.",
  ],

  Promotion: [
    "Fairness in promotions increases trust.",
    "Career growth opportunities retain talent.",
  ],
};
