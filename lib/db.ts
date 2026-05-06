import {
  collection, collectionGroup, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Project, Review } from '@/types'

function toISO(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (typeof value === 'string') return value
  return ''
}

function serializeProject(id: string, data: Record<string, unknown>): Project {
  return {
    ...data,
    id,
    createdAt: toISO(data.createdAt),
    completedAt: toISO(data.completedAt),
  } as Project
}

function serializeReview(id: string, data: Record<string, unknown>): Review {
  return {
    ...data,
    id,
    createdAt: toISO(data.createdAt),
  } as Review
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('completedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => serializeProject(d.id, d.data() as Record<string, unknown>))
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, 'projects'),
    where('featured', '==', true),
    orderBy('completedAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => serializeProject(d.id, d.data() as Record<string, unknown>))
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id))
  if (!snap.exists()) return null
  return serializeProject(snap.id, snap.data() as Record<string, unknown>)
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
  return snap.docs.map(d => serializeReview(d.id, d.data() as Record<string, unknown>))
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

// ─── Clients ──────────────────────────────────────────────────────────────────

export interface ClientData {
  password: string
  businessName: string
  service: string
}

export async function getClient(username: string): Promise<ClientData | null> {
  const snap = await getDoc(doc(db, 'Clients', username))
  if (!snap.exists()) return null
  return snap.data() as ClientData
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string
  clientUsername: string
  businessName: string
  service: string
  issue: string
  description: string
  contactNumber: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'resolved'
  adminComment: string
  resolutionScreenshotUrl: string
  createdAt: string
  updatedAt: string
}

function serializeTicket(id: string, data: Record<string, unknown>): Ticket {
  return {
    id,
    clientUsername: (data.clientUsername as string) ?? '',
    businessName: (data.businessName as string) ?? '',
    service: (data.service as string) ?? '',
    issue: (data.issue as string) ?? '',
    description: (data.description as string) ?? '',
    contactNumber: (data.contactNumber as string) ?? '',
    urgency: (data.urgency as Ticket['urgency']) ?? 'medium',
    status: (data.status as Ticket['status']) ?? 'open',
    adminComment: (data.adminComment as string) ?? '',
    resolutionScreenshotUrl: (data.resolutionScreenshotUrl as string) ?? '',
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  }
}

export async function addTicket(
  client: { username: string; businessName: string; service: string },
  data: { issue: string; description: string; contactNumber: string; urgency: Ticket['urgency'] }
) {
  return addDoc(collection(db, 'Clients', client.username, 'tickets'), {
    ...data,
    clientUsername: client.username,
    businessName: client.businessName,
    service: client.service,
    status: 'open',
    adminComment: '',
    resolutionScreenshotUrl: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getClientTickets(username: string): Promise<Ticket[]> {
  const q = query(collection(db, 'Clients', username, 'tickets'))
  const snap = await getDocs(q)
  const tickets = snap.docs.map(d => serializeTicket(d.id, d.data() as Record<string, unknown>))
  return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getAllTickets(): Promise<Ticket[]> {
  const snap = await getDocs(collectionGroup(db, 'tickets'))
  const tickets = snap.docs.map(d => serializeTicket(d.id, d.data() as Record<string, unknown>))
  return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateTicket(
  clientUsername: string,
  ticketId: string,
  data: Partial<Pick<Ticket, 'status' | 'adminComment' | 'resolutionScreenshotUrl'>>
) {
  return updateDoc(doc(db, 'Clients', clientUsername, 'tickets', ticketId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
