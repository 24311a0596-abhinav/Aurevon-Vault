export interface Subject { id: string; name: string; color: string }
export interface Note { id: string; title: string; body: string; subjectId: string | null }
export const COLORS = ['#DEDBC8', '#E8A87C', '#85CDCA', '#C38D9E', '#8EA7E9', '#A0C49D', '#E27D60'];
