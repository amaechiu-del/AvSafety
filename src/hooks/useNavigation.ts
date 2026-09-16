import { useState, useEffect, useCallback } from 'react';

export function useNavigation(defaultSection: string = 'home') {
  const [activeSection, setActiveSection] = useState(defaultSection);

  const handleNavigate = useCallback((sectionId: string, smooth: boolean = true) => {
    setActiveSection(sectionId);
    
    const scrollToTarget = () => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      }
    };

    window.requestAnimationFrame(scrollToTarget);
  }, []);

  useEffect(() => {
    let timerId: number | null = null;

    const parseRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path.includes('/volunteer') || hash === '#volunteer' || (search.includes('ref=') && !search.includes('rsvp'))) {
        return 'volunteer';
      } else if (path.includes('/rsvp') || hash === '#rsvp') {
        return 'rsvp';
      } else if (path.includes('/share') || hash === '#share') {
        return 'share';
      } else if (path.includes('/register') || hash === '#register') {
        return 'register';
      } else if (hash.startsWith('#')) {
        const targetId = hash.substring(1);
        if (targetId) return targetId;
      }
      return null;
    };

    const targetSection = parseRoute();
    if (targetSection) {
      timerId = window.setTimeout(() => {
        handleNavigate(targetSection, false);
      }, 150);
    }

    const handleHashChange = () => {
      const route = parseRoute();
      if (route) {
        handleNavigate(route, true);
      }
    };

    window.addEventListener('hashchange', handleHashChange, { passive: true });
    window.addEventListener('popstate', handleHashChange, { passive: true });

    return () => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [handleNavigate]);

  return {
    activeSection,
    handleNavigate
  };
}
