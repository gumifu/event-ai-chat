# Lab: Check & Summarize Your Idea

This document supports the **Check / Summarize (10 min)** step: summarize the idea, organize the file, and record whether the solution hypothesis was validated after user testing.

---

## 1. Summarize Your Idea

### Problem
People in the community often miss out on events because they don’t know what’s happening around them.

### Solution (MVP)
An app that helps locals **find** and **attend** events in their area by:

- **Listing** local events (in-house + partner sources) in one place  
- **Providing details** (title, date, venue, price, link to more info)  
- **Enabling attendance** via links to event pages / ticket purchase (OR “buys a ticket” as per briefing)

### Target Users
Residents aged **18–35** who want to engage more with their local community.

### Core MVP Features Delivered

| Feature | Description |
|--------|--------------|
| **Location** | Choose area (e.g. Vancouver, New York, Tokyo); events filtered by location when searching. |
| **Search** | Keyword search; optional AI-style search via chat. |
| **Event list** | Cards with image, title, date, venue, price; tabs: All / Your events / Partner events. |
| **Event details** | Each card links to event URL (details or ticket purchase). |
| **Quick filters** | Tags (e.g. Music, Tech, Sports) to narrow results. |
| **AI picks** | Recommended events section; AI chat panel for conversational discovery. |

---

## 2. Organize the File (Project Structure)

- **Technical overview & API**: [docs/README.md](./README.md)  
- **Root**: [README.md](../README.md) — quick start and data/API pointers.

**Key paths:**

| Role | Path |
|------|------|
| Main UI | `src/components/EventSearchApp.tsx` |
| Event list & cards | `src/components/EventList.tsx`, `EventCard.tsx`, `EventCardRow.tsx` |
| Search & filters | `src/components/SearchForm.tsx`, `src/components/TagRow.tsx` |
| AI chat | `src/components/AIChatPanel.tsx` |
| APIs | `src/app/api/events/`, `src/app/api/recommend/`, `src/app/api/chat/` |
| Data (mock) | `src/data/events-own.ts`, `src/data/events-external.ts` |
| Types | `src/types/event.ts` |

---

## 3. User Testing & Hypothesis

*Fill this section after conducting simple user testing (e.g. 1:1).*

### Hypothesis (to validate)
*Example: “Users aged 18–35 will understand that they can find local events in one place and open details or buy tickets from the card link.”*

**Your hypothesis:**  
<!-- TODO: Write in one sentence what you wanted to validate -->

---

### Was the hypothesis validated?

**☐ Yes**  
**☐ No**

---

### If **Yes** — What did the user understand?

*Example: “They quickly found the search bar, changed location, and clicked a card to open the event page. They understood that ‘See All’ and card links lead to more info or tickets.”*

<!-- TODO: Write what the user(s) understood and how they used the app -->

---

### If **No** — Why is the project not the solution?

*Example: “Users expected to buy tickets inside the app; they didn’t realize the card link was the way to attend. The location filter was not obvious.”*

<!-- TODO: Write why the current product did not match user expectations or solve the problem -->

---

## 4. Next Steps (optional)

- [ ] If validated: note one improvement to prioritize next.  
- [ ] If not validated: note one change (e.g. copy, flow, feature) that would make it closer to the solution.
