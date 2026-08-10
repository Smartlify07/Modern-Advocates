import { Handshake, HeartPlus, Laptop } from "lucide-react"
import React from "react"

const cardsData = [
  {
    id: 1,
    title: "Healthcare Navigation",
    icon: HeartPlus,
    description:
      "Helping individuals navigate healthcare, organize medical information, and make informed decisions.",
  },
  {
    id: 2,
    icon: Laptop,
    title: "Practical AI Skills",
    description:
      "Learn how to use AI to simplify daily life, strengthen career opportunities, navigate healthcare, and increase productivity.",
  },
  {
    id: 3,
    icon: Handshake,
    title: "Community Support",
    description:
      "Connecting people with resources, encouragement, and practical guidance so no one faces life’s challenges alone.",
  },
]

const GallerySection = () => {
  return <section className="bg-ma-bg text-ma-text"></section>
}

export default GallerySection
