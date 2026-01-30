'use client'

import { useState } from 'react'
import { Filter, SortAsc } from 'lucide-react'

const slots = ['all', 'head', 'antennae', 'claws', 'thorax', 'legs', 'abdomen', 'tail', 'cosmetic']
const grades = ['all', 'general', 'rare', 'epic', 'legendary', 'one_of_one']
const sortOptions = ['newest', 'oldest', 'grade_high', 'grade_low', 'stat_high', 'stat_low']

export function InventoryFilters() {
  const [slot, setSlot] = useState('all')
  const [grade, setGrade] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showEquipped, setShowEquipped] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  return (
    <div className="card flex items-center gap-6">
      {/* Slot filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <select 
          value={slot} 
          onChange={(e) => setSlot(e.target.value)}
          className="input py-1 text-sm capitalize"
        >
          {slots.map(s => (
            <option key={s} value={s} className="capitalize">
              {s === 'all' ? 'All Slots' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Grade filter */}
      <div className="flex items-center gap-2">
        <select 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)}
          className="input py-1 text-sm"
        >
          {grades.map(g => (
            <option key={g} value={g}>
              {g === 'all' ? 'All Grades' : g === 'one_of_one' ? '1of1' : g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-slate-400" />
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="input py-1 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="grade_high">Grade (High→Low)</option>
          <option value="grade_low">Grade (Low→High)</option>
          <option value="stat_high">Stats (High→Low)</option>
          <option value="stat_low">Stats (Low→High)</option>
        </select>
      </div>

      <div className="flex-1" />

      {/* Quick toggles */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showEquipped}
          onChange={(e) => setShowEquipped(e.target.checked)}
          className="rounded border-slate-600"
        />
        Equipped Only
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showFavorites}
          onChange={(e) => setShowFavorites(e.target.checked)}
          className="rounded border-slate-600"
        />
        Favorites Only
      </label>
    </div>
  )
}
