"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { ChevronDown, Gift, Star, Stethoscope } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function EmpowermentSection() {
  return (
    <section id="about" className="bg-white">
      <div className="marketing-container">
        <header className="mx-auto mb-10 text-center text-3xl font-bold sm:mb-20 sm:max-w-[508px] lg:text-5xl">
          <h1 className="text-center">Empowering People to Move Forward</h1>
        </header>

        <div className="grid gap-10 sm:grid-cols-3 sm:items-end sm:gap-10">
          <RestoreHopeCard />
          <BuildIndependenceCard />
          <NeverNavigateAloneCard />
        </div>
      </div>
    </section>
  )
}

export function RestoreHopeCard() {
  return (
    <div className="relative flex h-120 w-full flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#ECE8FF] px-7.5 py-10">
      <div>
        <h1 className="mb-2 text-start text-3xl font-bold">Restore Hope</h1>
        <p className="text-sm font-normal">
          When illness changes everything, hope becomes the first step toward
          rebuilding.
        </p>
      </div>

      <motion.div
        initial={{ y: 160 }}
        whileInView={{ y: 40 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="h-[272px] rounded-t-2xl bg-white px-4 py-5 2xl:w-[340px]"
      >
        <h1 className="mb-5 text-lg font-bold">Get the support you need</h1>
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Field
              label="Support type"
              placeholder="Consultation + travel assistance"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Field label="Estimated cost" placeholder="$750-$1,250" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export function NeverNavigateAloneCard() {
  return (
    <div className="relative flex h-120 w-full flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#ECE8FF] px-7.5 py-10">
      <div>
        <h1 className="mb-2 text-start text-3xl font-bold">
          Never Navigate Alone
        </h1>
        <p className="text-sm font-normal">
          Connect with a community that understands your journey and walks
          beside you.
        </p>
      </div>

      <motion.div
        initial={{ y: 160 }}
        whileInView={{ y: 40 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="h-[272px] overflow-hidden rounded-t-2xl bg-white px-4 py-5 2xl:w-[340px]"
      >
        <h1 className="mb-5 text-lg font-bold">Connect to a specialist</h1>

        <div className="grid gap-2.5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-start gap-2 p-2.5">
              <Avatar className="size-12 shrink-0">
                <AvatarImage
                  fetchPriority="high"
                  src="/figma-home/M-Anderson.png"
                />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold text-primary">
                    Dr. M. Anderson
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Washington D.C, USA
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Star
                      className="shrink-0 fill-[#F8BD00] text-[#F8BD00]"
                      size={20}
                    />{" "}
                    5.0
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-primary">
                    <Stethoscope className="shrink-0" size={20} /> 80
                    Surgeries/yr
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="flex items-start gap-2 p-2.5">
              <Avatar className="size-12 shrink-0">
                <AvatarImage
                  fetchPriority="high"
                  src="/figma-home/A-Rivera.png"
                />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold text-primary">
                    Dr. A. Rivera
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Washington D.C, USA
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Star
                      className="shrink-0 fill-[#F8BD00] text-[#F8BD00]"
                      size={20}
                    />{" "}
                    5.0
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-primary">
                    <Stethoscope className="shrink-0" size={20} /> 80
                    Surgeries/yr
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export function BuildIndependenceCard() {
  return (
    <div className="relative flex h-152 w-full flex-col items-center justify-between overflow-hidden rounded-2xl bg-ma-admin-primary px-7.5 py-10">
      <div>
        <h1 className="mb-2 text-start text-3xl font-bold text-white">
          Build Independence
        </h1>
        <p className="text-sm font-normal text-white">
          Learn practical AI skills, digital tools, and strategies that
          strengthen financial resilience
        </p>
      </div>
      <motion.div
        initial={{ y: 280 }}
        whileInView={{ y: 40 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex h-[375px] items-center justify-center rounded-t-2xl bg-[#201063] px-4 py-5 2xl:w-[340px]"
      >
        <Image
          src="/figma-home/girl-with-phone.png"
          alt="A girl with a phone wearing a blue shirt"
          width={235}
          height={340}
          className="translate-y-8"
          priority
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute top-[14%] -right-4 flex h-14 w-[174px] justify-between rounded-sm bg-white p-2.5"
        >
          <div>
            <h3 className="mb-0.5 text-[8px] font-semibold text-primary">
              Week 2: AI, Economic Mobility
            </h3>
            <p className="text-[6px] text-primary">0/9 | 1 hr 30mins</p>{" "}
          </div>

          <div className="flex size-3.5 items-center justify-center rounded-full border text-primary">
            <ChevronDown size={7} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="absolute bottom-12 -left-4 flex h-14 w-[174px] justify-between rounded-sm bg-white p-2.5"
        >
          <div>
            <h3 className="mb-0.5 text-[8px] font-semibold text-primary">
              Week 2: AI Productivity and Prompting
            </h3>
            <p className="text-[6px] text-primary">0/9 | 1 hr 30mins</p>{" "}
          </div>

          <div className="flex size-3.5 items-center justify-center rounded-full border text-primary">
            <ChevronDown size={7} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border px-2.5 py-2.5">
      <h3 className="font-semibold tracking-tight text-muted-foreground">
        {label}
      </h3>
      <div className="relative rounded-lg border bg-[#F8FAFC] px-4 py-2 text-primary">
        <div className="absolute top-1/2 right-4 shrink-0 -translate-y-1/2">
          <ChevronDown size={20} />
        </div>
        <p className="w-[140px] truncate text-sm font-normal text-primary">
          {placeholder}
        </p>
      </div>
    </div>
  )
}
