const fs = require("fs")
const path = require("path")

// Content for the about page
const aboutContent = `# About Me

I'm a writer, developer, and thinker interested in technology, design, and the intersection of human cognition and digital interfaces. This blog is where I share my thoughts, ideas, and projects.

My background includes software development, UX design, and cognitive psychology research. I'm particularly interested in how we can create digital experiences that work with our cognitive processes rather than against them.

## About This Site

This site is built with Next.js, React, Tailwind CSS, and MDX. It's designed to be minimalist and content-focused, drawing inspiration from sites like LessWrong, Gwern.net, and Quanta Magazine.

The design principles for this site include:

- Content-first approach with minimal distractions
- Clean typography for comfortable reading
- Responsive design that works well on all devices
- Dark mode support for comfortable reading in different lighting conditions

## Contact

You can reach me at example@example.com or connect with me on [Twitter](https://twitter.com) and [GitHub](https://github.com).`

// Content for hello-world post
const helloWorldContent = `---
title: "The Evolution of Scientific Thinking in the Modern Era"
date: "March 22, 2025"
excerpt: "An exploration of how scientific methodology has evolved over the past century and its implications for future research."
readingTime: "8"
tags: ["science", "philosophy", "research"]
---

# The Evolution of Scientific Thinking in the Modern Era

## Introduction

Scientific thinking has undergone significant transformations over the past century. From the rigid methodologies of the early 20th century to the more fluid, interdisciplinary approaches we see today, the way we pursue knowledge continues to evolve.

## The Early Modern Period

The early 20th century was characterized by strict adherence to the scientific method. Researchers followed a linear process:

1. Observation
2. Hypothesis formation
3. Experimentation
4. Analysis
5. Conclusion

This structured approach yielded remarkable discoveries but also had limitations in addressing complex, multifaceted problems.

## The Mid-Century Shift

By the mid-20th century, scientists began recognizing the value of cross-disciplinary collaboration. The boundaries between physics, chemistry, and biology started to blur, giving rise to fields like:

- Biochemistry
- Quantum biology
- Computational neuroscience

## Contemporary Approaches

Today's scientific landscape is marked by:

### Data-Driven Discovery

The abundance of data has transformed how hypotheses are formed and tested. Machine learning algorithms can now identify patterns that human researchers might miss.

### Open Science Movement

The push for transparency and reproducibility has changed how research is conducted and shared. Open access journals, pre-print servers, and public datasets have democratized knowledge.

### Citizen Science

Non-professionals now contribute meaningfully to scientific progress through distributed projects and crowdsourced data collection.

## Looking Forward

As we move further into the 21st century, scientific thinking will likely continue to evolve. The integration of artificial intelligence, quantum computing, and global collaborative networks promises to accelerate discovery in ways we can barely imagine.`

// Content for minimalist-blog project
const minimalistBlogContent = `---
title: "Minimalist Blog Platform"
excerpt: "A clean, content-focused blog platform built with Next.js, React, and Tailwind CSS, designed for optimal reading experience."
technologies: ["Next.js", "React", "Tailwind CSS", "MDX"]
link: "https://github.com/example/minimalist-blog"
---

# Minimalist Blog Platform

## Project Overview

This project is a modern, minimalist blog platform designed to prioritize content and reading experience. Built with Next.js, React, and Tailwind CSS, it offers a clean, distraction-free environment for both writers and readers.

## Key Features

- **Content-First Design**: Typography and layout optimized for reading
- **MDX Support**: Write in Markdown with the ability to embed React components
- **Responsive Layout**: Optimized for all device sizes
- **Dark Mode**: Automatic and manual theme switching
- **SEO Optimized**: Built-in metadata management

## Technical Details

The platform is built on a modern stack:

- **Next.js**: For server-side rendering and static site generation
- **React**: For component-based UI development
- **Tailwind CSS**: For utility-first styling
- **MDX**: For enhanced content creation

## Development Process

This project was developed over a three-month period, with particular attention paid to typography, spacing, and reading comfort. Multiple iterations of the design were tested with real users to ensure an optimal reading experience.`

// Create content directories and files
function setupContentFiles() {
  const contentDir = path.join(process.cwd(), "content")
  const postsDir = path.join(contentDir, "posts")
  const projectsDir = path.join(contentDir, "projects")

  console.log("Setting up content directories and files...")
  console.log("Current working directory:", process.cwd())

  // Create content directory
  if (!fs.existsSync(contentDir)) {
    console.log("Creating content directory...")
    fs.mkdirSync(contentDir)
  }

  // Create posts directory
  if (!fs.existsSync(postsDir)) {
    console.log("Creating posts directory...")
    fs.mkdirSync(postsDir)
  }

  // Create projects directory
  if (!fs.existsSync(projectsDir)) {
    console.log("Creating projects directory...")
    fs.mkdirSync(projectsDir)
  }

  // Create about.mdx
  const aboutFilePath = path.join(contentDir, "about.mdx")
  if (!fs.existsSync(aboutFilePath)) {
    console.log("Creating about.mdx...")
    fs.writeFileSync(aboutFilePath, aboutContent)
  }

  // Create hello-world.mdx
  const helloWorldFilePath = path.join(postsDir, "hello-world.mdx")
  if (!fs.existsSync(helloWorldFilePath)) {
    console.log("Creating hello-world.mdx...")
    fs.writeFileSync(helloWorldFilePath, helloWorldContent)
  }

  // Create minimalist-blog.mdx
  const minimalistBlogFilePath = path.join(projectsDir, "minimalist-blog.mdx")
  if (!fs.existsSync(minimalistBlogFilePath)) {
    console.log("Creating minimalist-blog.mdx...")
    fs.writeFileSync(minimalistBlogFilePath, minimalistBlogContent)
  }

  console.log("Content setup complete!")

  // List all created files and directories
  console.log("\nVerifying created files and directories:")

  if (fs.existsSync(contentDir)) {
    console.log("✅ Content directory exists")

    const contentItems = fs.readdirSync(contentDir)
    console.log(`Content directory contains: ${contentItems.join(", ")}`)

    if (fs.existsSync(postsDir)) {
      console.log("✅ Posts directory exists")
      const postItems = fs.readdirSync(postsDir)
      console.log(`Posts directory contains: ${postItems.join(", ")}`)
    } else {
      console.log("❌ Posts directory is missing")
    }

    if (fs.existsSync(projectsDir)) {
      console.log("✅ Projects directory exists")
      const projectItems = fs.readdirSync(projectsDir)
      console.log(`Projects directory contains: ${projectItems.join(", ")}`)
    } else {
      console.log("❌ Projects directory is missing")
    }

    if (fs.existsSync(aboutFilePath)) {
      console.log("✅ about.mdx exists")
    } else {
      console.log("❌ about.mdx is missing")
    }
  } else {
    console.log("❌ Content directory is missing")
  }
}

// Run the setup
setupContentFiles()
