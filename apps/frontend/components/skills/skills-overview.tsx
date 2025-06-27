"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getHardSkills, getSoftSkills } from "@/lib/mock-skills-data"
import { Code, Users } from "lucide-react"

export default function SkillsOverview() {
  const hardSkills = getHardSkills()
  const softSkills = getSoftSkills()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="grid gap-6 md:grid-cols-2" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Hard Skills
              </CardTitle>
              <CardDescription>Competenze tecniche e strumenti</CardDescription>
            </div>
            <div className="text-2xl font-bold">{hardSkills.length}</div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hardSkills.slice(0, 12).map((skill) => (
                <Badge key={skill.id} variant="outline" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {hardSkills.length > 12 && (
                <Badge variant="secondary" className="text-xs">
                  +{hardSkills.length - 12} altre
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Soft Skills
              </CardTitle>
              <CardDescription>Competenze trasversali e relazionali</CardDescription>
            </div>
            <div className="text-2xl font-bold">{softSkills.length}</div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
