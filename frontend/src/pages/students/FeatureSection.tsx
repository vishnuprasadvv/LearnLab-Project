import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      title: "Occasional Video Update",
      description:
        "Stay up to date with the latest trends and industry developments through our occasional video updates. Our experts share valuable insights to help you stay ahead in your field.",
    },
    {
      title: "Online Course From Experts",
      description:
        "Learn directly from industry experts with our online courses. Our instructors have years of experience and knowledge, ensuring you get the best education from trusted professionals.",
    },
    {
      title: "Class Program Options",
      description:
        "We offer a variety of class programs designed to suit your schedule and learning preferences. Whether you're looking for self-paced lessons or live interactive sessions, we have you covered.",
    },
    {
      title: "500+ High Quality Courses",
      description:
        "With over 500 high-quality courses available, you'll have access to a wide range of topics and disciplines. Whether you're looking to improve your career skills or explore new passions, there's a course for everyone.",
    },
    {
      title: "Earn a Certificate",
      description:
        "Upon completing a course, you can earn a certification that demonstrates your new skills and knowledge. This certificate can boost your career and show potential employers your commitment to professional development.",
    },
  ];

  return (
    <section className="w-full  px-4 py-16 md:py-24 dark:bg-slate-300">
      <div className="container max-w-7xl place-self-center">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="max-w-2xl p-6">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-white">
              Why choose our classes
            </h2>
            <p className="text-slate-800 dark:text-white">
            Our classes provide expert-led learning with flexible schedules, ensuring you can learn at your own pace. Whether you want to advance your career, develop new skills, or explore a passion, our courses are designed to guide you every step of the way.
            </p>
          </div>
          {features.map((feature, index) => (
            <Card key={index} className="bg-blue-50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Play className="h-5 w-5 fill-blue-600 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-blue-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
