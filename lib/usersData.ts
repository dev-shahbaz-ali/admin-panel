import type { User } from "./types";

export const mockUsers: User[] = [
  { id: "u01", name: "Sarah Chen",      email: "sarah.chen@example.com",      role: "Admin",  status: "Active",    joined: "2023-01-14", avatar: "SC", sessions: 142 },
  { id: "u02", name: "James Morris",    email: "james.morris@example.com",    role: "Editor", status: "Active",    joined: "2023-03-22", avatar: "JM", sessions: 98  },
  { id: "u03", name: "Priya Patel",     email: "priya.patel@example.com",     role: "Viewer", status: "Active",    joined: "2023-05-09", avatar: "PP", sessions: 76  },
  { id: "u04", name: "Leo Kim",         email: "leo.kim@example.com",         role: "Editor", status: "Active",    joined: "2023-06-18", avatar: "LK", sessions: 61  },
  { id: "u05", name: "Amira Hassan",    email: "amira.hassan@example.com",    role: "Viewer", status: "Inactive",  joined: "2023-07-02", avatar: "AH", sessions: 14  },
  { id: "u06", name: "Tom Nguyen",      email: "tom.nguyen@example.com",      role: "Admin",  status: "Active",    joined: "2022-11-30", avatar: "TN", sessions: 210 },
  { id: "u07", name: "Fatima Al-Said",  email: "fatima.alsaid@example.com",   role: "Editor", status: "Active",    joined: "2023-08-15", avatar: "FA", sessions: 55  },
  { id: "u08", name: "Ryan Park",       email: "ryan.park@example.com",       role: "Viewer", status: "Suspended", joined: "2023-02-27", avatar: "RP", sessions: 3   },
  { id: "u09", name: "Elena Rossi",     email: "elena.rossi@example.com",     role: "Editor", status: "Active",    joined: "2023-09-10", avatar: "ER", sessions: 88  },
  { id: "u10", name: "Marcus Webb",     email: "marcus.webb@example.com",     role: "Viewer", status: "Active",    joined: "2023-10-01", avatar: "MW", sessions: 42  },
  { id: "u11", name: "Yuki Tanaka",     email: "yuki.tanaka@example.com",     role: "Admin",  status: "Active",    joined: "2022-09-19", avatar: "YT", sessions: 189 },
  { id: "u12", name: "Omar Farouq",     email: "omar.farouq@example.com",     role: "Viewer", status: "Inactive",  joined: "2023-04-05", avatar: "OF", sessions: 8   },
  { id: "u13", name: "Clara Dubois",    email: "clara.dubois@example.com",    role: "Editor", status: "Active",    joined: "2023-11-20", avatar: "CD", sessions: 34  },
  { id: "u14", name: "Arjun Sharma",    email: "arjun.sharma@example.com",    role: "Viewer", status: "Active",    joined: "2023-12-03", avatar: "AS", sessions: 29  },
  { id: "u15", name: "Nina Petrova",    email: "nina.petrova@example.com",    role: "Editor", status: "Suspended", joined: "2023-01-28", avatar: "NP", sessions: 1   },
  { id: "u16", name: "David Okafor",    email: "david.okafor@example.com",    role: "Viewer", status: "Active",    joined: "2024-01-07", avatar: "DO", sessions: 17  },
  { id: "u17", name: "Sophie Laurent",  email: "sophie.laurent@example.com",  role: "Editor", status: "Active",    joined: "2024-02-14", avatar: "SL", sessions: 46  },
  { id: "u18", name: "Kai Andersen",    email: "kai.andersen@example.com",    role: "Viewer", status: "Active",    joined: "2024-03-22", avatar: "KA", sessions: 23  },
  { id: "u19", name: "Mei Ling Zhou",   email: "mei.zhou@example.com",        role: "Admin",  status: "Active",    joined: "2022-08-11", avatar: "MZ", sessions: 167 },
  { id: "u20", name: "Carlos Rivera",   email: "carlos.rivera@example.com",   role: "Viewer", status: "Inactive",  joined: "2023-06-30", avatar: "CR", sessions: 5   },
];

export const ROLES    = ["Admin", "Editor", "Viewer"] as const;
export const STATUSES = ["Active", "Inactive", "Suspended"] as const;
