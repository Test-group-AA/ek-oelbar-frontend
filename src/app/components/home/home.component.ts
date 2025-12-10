// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Feature {
  emoji: string;
  title: string;
  description: string;
}

export interface HistoryItem {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features: Feature[] = [
    { emoji: '🍺', title: 'Vores fadøl', description: 'Frisk tappet hver gang' },
    { emoji: '🎵', title: 'Live musik', description: 'Hver fredag aften' },
    { emoji: '🏛️', title: 'Hyggelige lokaler', description: 'Perfekt til studerende' }
  ];

  history: HistoryItem[] = [
    { 
      year: '2020', 
      title: 'Starten', 
      description: 'EK Ølbar blev grundlagt af tre passionerede KEA-studerende, der ønskede at skabe et sted hvor medstuderende kunne mødes og nyde god øl i afslappede omgivelser.' 
    },
    { 
      year: '2022', 
      title: 'Ekspansion', 
      description: 'Vi udvidede vores lokaler og introducerede vores populære fredag-events med live underholdning, som hurtigt blev en fast tradition blandt studerende.' 
    },
    { 
      year: '2025', 
      title: 'I dag', 
      description: 'EK Ølbar er nu et fast mødested for studerende fra hele København. Vi fortsætter med at tilbyde kvalitetsøl, god stemning og underholdning hver fredag.' 
    }
  ];
}