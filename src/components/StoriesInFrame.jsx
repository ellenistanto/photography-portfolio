import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function StoriesInFrame({ onSelectCategory }) {
  const stories = [
    {
      num: '01',
      id: 'concerts',
      title: 'Music & Concert',
      desc: 'Sweat, strobe lights, and raw acoustic euphoria from front row to backstage.',
      bg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      action: 'Explore Stages'
    },
    {
      num: '02',
      id: 'portraits',
      title: 'Portraits',
      desc: 'Intimate gazes, candid vulnerabilities, and honest facial landscapes.',
      bg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      action: 'View Portraits'
    },
    {
      num: '03',
      id: 'people-places',
      title: 'People & Places',
      desc: 'Wandering misty Indonesian highlands and vibrant midnight city crossings.',
      bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      action: 'View Journeys'
    },
    {
      num: '04',
      id: 'brands',
      title: 'Brands & Products',
      desc: 'Elevated commercial visual identity, streetwear campaigns, and product aesthetics.',
      bg: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
      action: 'View Campaigns'
    }
  ];

  return (
    <section className="stories-section" id="storiesSection">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Stories in Frame</p>
          <h2 className="section-title">Selected Visual Disciplines</h2>
          <p className="section-subtitle">
            A curated exploration into distinct photographic narratives across sound, humans, and lifestyle.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map(story => (
            <div 
              key={story.id}
              className="story-card"
              onClick={() => onSelectCategory(story.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(story.id);
                }
              }}
            >
              <div className="story-bg" style={{ backgroundImage: `url('${story.bg}')` }}></div>
              <div className="story-card-overlay">
                <span className="story-number">{story.num}</span>
                <div className="story-info">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-desc">{story.desc}</p>
                  <span className="story-link">
                    <span>{story.action}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
