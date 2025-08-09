<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-900">Fasten-Phasen</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Phase 1: 0-3 Stunden -->
        <div class="flex gap-3 p-3 bg-blue-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-blue-900">0-3 Stunden</h4>
            <p class="text-sm text-blue-800">Verdauung läuft noch. Insulinspiegel beginnt zu sinken.</p>
          </div>
        </div>

        <!-- Phase 2: 3-8 Stunden -->
        <div class="flex gap-3 p-3 bg-yellow-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-yellow-900">3-8 Stunden</h4>
            <p class="text-sm text-yellow-800">Insulin normalisiert sich. Körper beginnt gespeicherte Glukose zu nutzen.</p>
          </div>
        </div>

        <!-- Phase 3: 8-12 Stunden -->
        <div class="flex gap-3 p-3 bg-orange-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-orange-900">8-12 Stunden</h4>
            <p class="text-sm text-orange-800">Fettverbrennung startet! Körper wechselt von Glukose zu Fett als Energiequelle.</p>
          </div>
        </div>

        <!-- Phase 4: 12-16 Stunden -->
        <div class="flex gap-3 p-3 bg-emerald-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-emerald-900">12-16 Stunden</h4>
            <p class="text-sm text-emerald-800">Ketose beginnt. Erste Ketone werden produziert. Mentale Klarheit steigt.</p>
          </div>
        </div>

        <!-- Phase 5: 16+ Stunden -->
        <div class="flex gap-3 p-3 bg-purple-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-purple-900">16+ Stunden</h4>
            <p class="text-sm text-purple-800">Autophagie aktiviert! Zellerneuerung und -reparatur beginnen. Tiefe Ketose.</p>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          Basierend auf wissenschaftlichen Studien zu Intervallfasten.<br>
          <span class="font-medium">Quellen:</span> Harvard Health, NIH, Journal of Clinical Investigation
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>
