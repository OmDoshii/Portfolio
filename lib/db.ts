import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Project, Review } from '@/types'

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('completedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, 'projects'),
    where('featured', '==', true),
    orderBy('completedAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Project
}

export async function addProject(data: Omit<Project, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateProject(id: string, data: Partial<Project>) {
  return updateDoc(doc(db, 'projects', id), data)
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, 'projects', id))
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review))
}

export async function addReview(data: Omit<Review, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateReview(id: string, data: Partial<Review>) {
  return updateDoc(doc(db, 'reviews', id), data)
}

export async function deleteReview(id: string) {
  return deleteDoc(doc(db, 'reviews', id))
}
