"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getInventoryItems, searchInventoryItems, type InventoryItem, groceryItems } from '@/services/inventoryService'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface InventoryTrackerProps {
  predictions: {
    recommendations: string[];
    wasteAmount: number;
    savingsPotential: number;
  };
}

const IMAGE_LOADING_STATES = new Map<string, boolean>();

export default function InventoryTracker({ predictions }: InventoryTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [recentItems, setRecentItems] = useState<InventoryItem[]>([])
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    expiringItems: 0,
    lowStockItems: 0,
    totalValue: 0
  })

  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => new Set([...prev, itemId]))
  }

  const handleImageError = (itemId: string) => {
    // If image fails to load, use placeholder and mark as loaded
    handleImageLoad(itemId)
  }

  const updateRecentSearches = useCallback(async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await searchInventoryItems(query, {}, { page: currentPage, pageSize: 12 })
      if (!response || !Array.isArray(response.items)) {
        throw new Error('Invalid response format')
      }
      setRecentItems(response.items)
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error('Error searching items:', error)
      setError('Failed to fetch inventory items. Please try again.')
      setRecentItems([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowResults(true)
      updateRecentSearches(searchQuery)
    } else {
      setShowResults(false)
      setRecentItems([])
      setError(null)
    }
  }, [searchQuery, updateRecentSearches])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const getExpiryColor = (days: number) => {
    if (days > 7) return 'bg-green-500'
    if (days > 3) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStockColor = (quantity: number) => {
    if (quantity > 10) return 'bg-green-500'
    if (quantity > 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  function InventoryItemCard({ item, onSelect }: { item: InventoryItem; onSelect: (item: InventoryItem) => void }) {
    const [isImageLoaded, setIsImageLoaded] = useState(IMAGE_LOADING_STATES.get(item.imageUrl) || false);
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
      setIsImageLoaded(true);
      IMAGE_LOADING_STATES.set(item.imageUrl, true);
    };

    const handleImageError = () => {
      setImageError(true);
      setIsImageLoaded(true);
    };

    return (
      <Card 
        className="relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
        onClick={() => onSelect(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <Image
            src={imageError ? '/images/food/placeholder.jpg' : item.imageUrl}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={true}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          <p className="text-sm text-gray-500">Expires in: {item.daysUntilExpiry} days</p>
        </CardContent>
        {isHovered && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <Button variant="secondary" className="bg-white/90">
              View Details
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Inventory Tracker</h2>
      
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Total Items</h3>
          <p className="text-2xl font-bold text-white">{inventorySummary.totalItems}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Expiring Soon</h3>
          <p className="text-2xl font-bold text-red-400">{inventorySummary.expiringItems}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Low Stock</h3>
          <p className="text-2xl font-bold text-yellow-400">{inventorySummary.lowStockItems}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Total Value</h3>
          <p className="text-2xl font-bold text-green-400">${inventorySummary.totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Waste and Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
          <h3 className="text-sm text-red-400">Potential Waste</h3>
          <p className="text-2xl font-bold text-red-400">${predictions.wasteAmount.toFixed(2)}</p>
        </div>
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
          <h3 className="text-sm text-green-400">Savings Potential</h3>
          <p className="text-2xl font-bold text-green-400">${predictions.savingsPotential.toFixed(2)}</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search inventory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md text-gray-900 bg-white"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Recent Searches Grid */}
      {showResults && !isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-fr grid-flow-row">
            {recentItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: loadedImages.has(item.id) ? 1 : 0 }}
                exit={{ opacity: 0 }}
                className="relative group cursor-pointer h-full"
                onClick={() => setSelectedItem(item)}
              >
                <InventoryItemCard item={item} onSelect={setSelectedItem} />
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results Message */}
      {showResults && !isLoading && !error && recentItems.length === 0 && (
        <div className="text-center text-gray-300 py-8">
          No items found matching your search.
        </div>
      )}

      {/* Detailed Information Sidebar */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed right-0 top-0 h-screen w-96 bg-gray-800 p-6 shadow-lg overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-white">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">Item Details</h4>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
                  <p><span className="font-medium">Vendor:</span> {selectedItem.vendor}</p>
                  <p><span className="font-medium">Storage Location:</span> {selectedItem.storageLocation}</p>
                  <p><span className="font-medium">Batch Number:</span> {selectedItem.batchNumber}</p>
                  <p><span className="font-medium">Quantity:</span> {selectedItem.quantity}</p>
                  <p><span className="font-medium">Days Until Expiry:</span> {selectedItem.daysUntilExpiry}</p>
                  <p className={`font-medium ${selectedItem.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    Status: {selectedItem.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Similar Items */}
              {selectedItem.similarItems && selectedItem.similarItems.length > 0 && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-2">Similar Items</h4>
                  <ul className="grid grid-cols-1 gap-1">
                    {selectedItem.similarItems.slice(0, 7).map((item, index) => (
                      <li 
                        key={index} 
                        className="hover:text-white cursor-pointer py-1"
                        onClick={() => {
                          const similarItem = groceryItems.find((i: InventoryItem) => i.name === item);
                          if (similarItem) setSelectedItem(similarItem);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">Recommendations</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predictions.recommendations.map((rec, index) => (
                    <p key={index} className="text-gray-300">{rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 