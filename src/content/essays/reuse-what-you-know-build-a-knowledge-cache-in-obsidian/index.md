---
title: Reuse what you know - build a knowledge cache in Obsidian
date: 2025-06-22
description: Turning Obsidian into a personal knowledge cache is no trivial task. You need to ensure notes are easily found, even months later, to effectively reuse knowledge.  I faced challenges with this in the past, but by emphasizing connections, keywords, and backlinks instead of rigid hierarchies, my notes have become effortlessly accessible whenever similar challenges arise. The outcome is a flexible and scalable note system that keeps your hard-earned knowledge always within reach.
image: social-media.png
toc: true
topics:
  - Better Thinking
  - Tools for Thought
---

In the [previous article](/writing/how-i-use-obsidian-to-manage-mental-overload-in-fast-paced-tech-world), I described how using Obsidian helps me manage information overload and work more effectively.

Today I'll share my approach to structuring a note system to quickly and easily find needed notes.

The primary goal and true measure of an effective note system is how quickly and easily I can locate notes later. I often encounter similar problems, allowing me to draw on past insights to resolve them more efficiently. I want a system that acts like a "cache" of knowledge to speed up finding solutions for problems I had in the past.

The core principles of my note-taking involve writing notes as messages to my future self and focusing on connections rather than hierarchy.

## Cache knowledge for future self

To efficiently find and utilize information later, I write notes from a future perspective. I consider how I might want to retrieve this note later. For me it’s only few additional seconds during creating a note, but saving tone of time when I’m looking it after weeks of creating.

Usually I’m based on the following questions:

- Is it connected to a project, technology, person, or team? What contexts will help me locate the information again?
- Why will I need this note in a few weeks?
- When will it help speed up my work?

### Engineering problems, solutions and insights

For example, the first time I used `jest-e2e` (internal tool for running E2E tests), I struggled to understand why a test had failed. I spent an hour trying to figure it out, only to discover that a missing Feature Flag setting was causing the wrong branch to run. To prevent wasting time on this issue again, I created a note titled _"If E2E is broken, be sure the right Feature Flag is set up_" to describe the problem and the solution. I linked this note to others titled _"Jest-E2E"_ and _"Feature Flag"_.

Another example is a tricky bug related to [Relay](https://relay.dev/), where the cache was misused. To identify the root cause, I had to dive deep for a few hours, as it initially seemed like caching was the obvious issue. The correct solution turned out to be refreshing multiple connections.
After fixing the bug, I wanted to ensure I left a guide for myself and others to navigate a similar process more efficiently in the future. To accomplish this, I took detailed notes documenting the problem and solution, such as _"Relay allows refreshing multiple connections, use it instead of cache"_ and _"Be cautious with cache invalidation for Relay"_ I linked all of these notes to a central "Relay" reference for easy access.

Keywords like “Relay”, “Jest-E2E” or “GK” serve as hubs, grouping all related insights, problems, and solutions. Thanks to the backlinks feature in Obsidian, I can easily see all references to a particular keyword across my entire database. The benefit of this approach?

When I next encounter a weird end-to-end test or Relay problem (or just want to explain these topics to others), I can easily access all related notes by visiting the keyword-note. The note itself can remain empty; the backlinks are what truly matter. This "cache" helps me resolve similar problems more efficiently.

Below is another example from my private vault that displays all references to the keyword "Nauka" (Learning) that I created over time.

![Backlinks in practice](./01.webp)

### Projects and meetings

Similarly, you can create notes on a specific project or initiative to easily keep all related information. For example, during a meeting, you can quickly jot something down and add `[[ProjectX]]` to easily refer to it. Obsidian allows you to filter backlinks, e.g., you can filter references that are meetings. This is especially useful for double-checking a decision made in “some meeting in the past” about Project X.

> [!important] Refer to Daily Note
> If you don't want to create a separate note, you can just describe the problem and solution in your daily note, then connect it with keyword notes.

## Scaling the system

A system based on connections is super easy to grow and scale organically. If you have a lot of notes for testing and feel you need better navigation, you can build an “abstraction” for it, another level. Just put your “keyword notes” like “WWW Testing” and “Jest-E2E” under more generic term like “Testing” It allows you to go through the nodes top-down or bottom-up.

## Connections, Tags and Folders

### Connections

As you can see, it's important for my system to rely on connections. I try to avoid strict hierarchies. A hierarchical structure requires everything to be in one place, but notes often cover several ideas. They can be connected to multiple keywords. Also, finding a note after weeks of creating it is easier if the note is connected to multiple different nodes. I have multiple different paths to reach the note.

If I were to add a note about a certain decision made by "X" and "Y" related to "Project X" during "Meeting A," I would have 4 different starting points. This makes finding this information much easier.

### Tags

I use tags as attributes describing notes or bullet points in daily notes. They are additional metadata I can use to filter relevant information. If you think about a note like an object storing information tags describing this object (type, status, date) Typical tags I use are `#type/meeting`, `#type/article`, `#type/podcast` `#flashcard` `#todo`, `#💡`.

### Folders

I use folders mostly to maintain backward compatibility and integrate my notes with other systems, e.g., terminal, iOS, excluded folders, Obsidian Sync, and Cursor Editor (the last two only for personal Vault). As I mentioned, I avoid hierarchy and keep the folder structure as flat as possible. Thanks to connection-based organization and the advanced search offered by Obsidian, I don't feel the need for any precise structure.

---

This structure gives me confidence to safely store information and find it later. It has helped me reduce information overload, and I hope these ideas help you create your own system.

In the next articles I’ll describe my daily work with Obsidian and its integration with other tools to minimize the friction of adding information, but if you have any concrete topic/problem related to Obsidian in mind, let me know.
