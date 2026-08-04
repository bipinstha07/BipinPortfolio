import { useState, useEffect } from "react";
import { FiHome, FiCode, FiFolder, FiUsers, FiAward, FiMail } from "react-icons/fi";

function Sidebar() {
  const [activeSection, setActiveSection] = useState("home");

  const menuItems = [
    { id: "home", label: "Home", icon: FiHome },
    { id: "skills", label: "Skills", icon: FiCode },
    { id: "projects", label: "Projects", icon: FiFolder },
    { id: "research", label: "Research & Collaboration", icon: FiUsers },
    { id: "certificate", label: "Certificate", icon: FiAward },
    { id: "contact", label: "Contact", icon: FiMail },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // Slower scroll duration (1200ms)
      let start: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          setActiveSection(sectionId);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-full w-16 z-40 flex-col items-center justify-center">
      <nav className="flex flex-col gap-8 items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`transition-all duration-200 ${
                activeSection === item.id
                  ? "text-cyan-400"
                  : "text-white/40 hover:text-red-500/70"
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;

