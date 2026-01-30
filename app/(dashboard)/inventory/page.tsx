import { createClient } from '@/lib/supabase/server'
import { InventoryGrid } from '@/components/inventory-grid'
import { InventoryFilters } from '@/components/inventory-filters'

export default async function InventoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all inventory items
  const { data: items } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('user_id', user!.id)
    .order('grade_index', { ascending: false })
    .order('acquired_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-slate-400">
            {items?.length || 0} items collected
          </p>
        </div>
      </div>

      <InventoryFilters />
      
      <InventoryGrid items={items || []} />
    </div>
  )
}
