<template>
  <div class="consumer-public-map-shell relative h-full w-full overflow-hidden">
    <div id="consumer-public-map" class="absolute inset-0 h-full w-full"></div>

    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 md:inset-auto md:bottom-4 md:left-4 md:w-[320px] md:max-w-[calc(100vw-2rem)] md:px-0 md:pb-0">
      <div class="consumer-public-panel pointer-events-auto rounded-[22px] px-4 py-3.5 md:p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="consumer-public-eyebrow">CASURECO I Consumer Map</div>
            <div class="consumer-public-guide-title mt-1">Power Outage Map</div>
          </div>
          <button type="button" class="consumer-public-icon-btn" @click="legendExpanded = !legendExpanded" title="Toggle Guide">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="consumer-public-icon">
              <path
                :d="legendExpanded ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <p class="mt-2 hidden text-[0.8rem] leading-5 text-slate-600 md:block">
          View active consumer tickets and posted power interruptions by service area.
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <div class="consumer-public-chip">
            <span>{{ tickets.length }} ticket{{ tickets.length === 1 ? '' : 's' }}</span>
          </div>
          <div class="consumer-public-chip">
            <span>{{ filteredPowerInterruptions.length }} interruption{{ filteredPowerInterruptions.length === 1 ? '' : 's' }}</span>
          </div>
        </div>

        <div class="mt-2 flex gap-1">
          <button
            type="button"
            class="consumer-public-filter-tab"
            :class="interruptionFilter === 'today' ? 'consumer-public-filter-tab--active' : ''"
            @click="interruptionFilter = 'today'"
          >Today</button>
          <button
            type="button"
            class="consumer-public-filter-tab"
            :class="interruptionFilter === 'upcoming' ? 'consumer-public-filter-tab--active' : ''"
            @click="interruptionFilter = 'upcoming'"
          >Upcoming</button>
        </div>

        <div class="mt-3 flex items-center gap-2">
          <button
            type="button"
            class="consumer-public-icon-btn"
            @click="togglePowerInterruptionOverlay"
            :title="showPowerInterruptionOverlay ? 'Hide Power Interruptions' : 'Show Power Interruptions'"
          >
            <svg v-if="showPowerInterruptionOverlay" viewBox="0 0 24 24" aria-hidden="true" class="consumer-public-icon">
              <path d="M9 21h6M12 3v10M7 7l5-4 5 4M7 7l5 6 5-6M9 13l-3 8M15 13l3 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m4 4 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="consumer-public-icon">
              <path d="M9 21h6M12 3v10M7 7l5-4 5 4M7 7l5 6 5-6M9 13l-3 8M15 13l3 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <button type="button" class="consumer-public-icon-btn" @click="getAllTickets" title="Refresh">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="consumer-public-icon">
              <path d="M20 11a8 8 0 1 0 2 5.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M20 4v7h-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <button type="button" class="consumer-public-primary-btn ml-auto" @click="submitTicket">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="consumer-public-icon">
              <path d="M4 7a2 2 0 0 1 2-2h8l6 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M14 5v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span>Submit Ticket</span>
          </button>
        </div>

        <div v-if="legendExpanded" class="mt-4 space-y-4 border-t border-slate-200/90 pt-4">
          <div>
            <div class="consumer-public-legend-title">Ticket Status</div>
            <div class="consumer-public-legend-grid">
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#E53935]"></span><span>Open</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#FBC02D]"></span><span>Acknowledged</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#1E88E5]"></span><span>Troubleshooting</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#26A69A]"></span><span>Resolved</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#9E9E9E]"></span><span>Closed</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-dot bg-[#8E24AA]"></span><span>Reopened</span></div>
            </div>
          </div>

          <div>
            <div class="consumer-public-legend-title">Power Interruption Overlay</div>
            <div class="consumer-public-legend-grid">
              <div class="consumer-public-legend-item"><span class="consumer-public-swatch bg-[#F59E0B]"></span><span>Scheduled</span></div>
              <div class="consumer-public-legend-item"><span class="consumer-public-swatch bg-[#DC2626]"></span><span>Emergency</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_CENTER = [123.0589, 13.6917];
const DEFAULT_ZOOM = 11.5;

const POWER_INTERRUPTION_SOURCE_ID = 'consumer-power-interruptions';
const POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID = 'consumer-power-interruptions-highlight';
const POWER_INTERRUPTION_FILL_LAYER_ID = 'consumer-power-interruptions-fill';
const POWER_INTERRUPTION_LINE_LAYER_ID = 'consumer-power-interruptions-line';
const POWER_INTERRUPTION_HALO_LAYER_ID = 'consumer-power-interruptions-halo';
const POWER_INTERRUPTION_HIGHLIGHT_FILL_LAYER_ID = 'consumer-power-interruptions-highlight-fill';
const POWER_INTERRUPTION_HIGHLIGHT_LINE_LAYER_ID = 'consumer-power-interruptions-highlight-line';
const TICKET_SOURCE_ID = 'consumer-public-tickets';
const TICKET_CLUSTER_LAYER_ID = 'consumer-public-ticket-clusters';
const TICKET_CLUSTER_COUNT_LAYER_ID = 'consumer-public-ticket-cluster-count';
const TICKET_POINT_LAYER_ID = 'consumer-public-ticket-points';

export default {
  name: 'PowerOutageMap',
  data() {
    return {
      tickets: [],
      powerInterruptions: [],
      powerInterruptionGeoJson: null,
      powerInterruptionPolygonCache: {},
      map: null,
      mapLoaded: false,
      activeTicketPopup: null,
      activeInterruptionPopup: null,
      activeHoveredInterruptionKey: null,
      focusedInterruptionId: null,
      areaModel: 0,
      showPowerInterruptionOverlay: true,
      legendExpanded: true,
      date1: new Date().toISOString().split('T')[0],
      date2: new Date().toISOString().split('T')[0],
      interruptionFilter: 'today',
    };
  },
  computed: {
    powerInterruptionApiBase() {
      const base = import.meta.env.VITE_POWER_INTERRUPTION_API_URL || 'http://172.16.80.80:81';
      return base.replace(/\/$/, '');
    },
    routeInterruptionId() {
      const interruptionId = this.$route.query.interruption;
      return interruptionId != null && interruptionId !== '' ? String(interruptionId) : null;
    },
    filteredPowerInterruptions() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      return this.powerInterruptions.filter((interruption) => {
        const startAt = interruption.start_at ? new Date(interruption.start_at) : null;
        const endAt = interruption.end_at ? new Date(interruption.end_at) : null;

        if (this.interruptionFilter === 'today') {
          if (!startAt) return true;
          if (startAt >= todayStart && startAt <= todayEnd) return true;
          return startAt < todayStart && !!endAt && endAt >= todayStart;
        }

        if (!startAt) return false;
        return startAt > todayEnd;
      });
    },
  },
  watch: {
    interruptionFilter() {
      this.renderPowerInterruptionOverlays();
    },
  },
  created() {
    this.getAllTickets();
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    this.clearTicketMarkers();

    if (this.activeInterruptionPopup) {
      this.activeInterruptionPopup.remove();
      this.activeInterruptionPopup = null;
    }

    if (this.activeTicketPopup) {
      this.activeTicketPopup.remove();
      this.activeTicketPopup = null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      this.map = new maplibregl.Map({
        container: 'consumer-public-map',
        style: {
          version: 8,
          sources: {
            'osm-raster': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-raster-layer',
              type: 'raster',
              source: 'osm-raster',
            },
          ],
        },
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: true,
      });

      this.map.addControl(new maplibregl.NavigationControl(), 'top-left');

      this.map.on('load', () => {
        this.mapLoaded = true;
        this.ensureTicketLayers();
        this.ensurePowerInterruptionLayers();
        this.bringTicketLayersToFront();
        this.renderTicketMarkers();
        this.renderPowerInterruptionOverlays();
        this.setPowerInterruptionLayerVisibility();
        this.applyRouteInterruptionFocus();
      });
    },
    emptyFeatureCollection() {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    },
    ensureTicketLayers() {
      if (!this.map || this.map.getSource(TICKET_SOURCE_ID)) {
        return;
      }

      this.map.addSource(TICKET_SOURCE_ID, {
        type: 'geojson',
        data: this.emptyFeatureCollection(),
        cluster: true,
        clusterRadius: 42,
        clusterMaxZoom: 14,
      });

      this.map.addLayer({
        id: TICKET_CLUSTER_LAYER_ID,
        type: 'circle',
        source: TICKET_SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0F5FA8',
          'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 25, 26],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.92,
        },
      });

      this.map.addLayer({
        id: TICKET_CLUSTER_COUNT_LAYER_ID,
        type: 'symbol',
        source: TICKET_SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#FFFFFF',
        },
      });

      this.map.addLayer({
        id: TICKET_POINT_LAYER_ID,
        type: 'circle',
        source: TICKET_SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'marker_color'],
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 1,
          'circle-blur': 0.02,
        },
      });

      this.map.on('mouseenter', TICKET_CLUSTER_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', TICKET_CLUSTER_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', TICKET_POINT_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', TICKET_POINT_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('click', TICKET_CLUSTER_LAYER_ID, (event) => {
        const features = this.map.queryRenderedFeatures(event.point, { layers: [TICKET_CLUSTER_LAYER_ID] });
        const feature = features && features[0];
        if (!feature) {
          return;
        }

        const clusterId = feature.properties.cluster_id;
        this.map.getSource(TICKET_SOURCE_ID).getClusterExpansionZoom(clusterId, (error, zoom) => {
          if (error) {
            return;
          }

          this.map.easeTo({
            center: feature.geometry.coordinates,
            zoom,
          });
        });
      });

      this.map.on('click', TICKET_POINT_LAYER_ID, (event) => {
        const feature = event.features && event.features[0];
        if (!feature) {
          return;
        }

        this.openTicketPopup(feature);
      });
    },
    ensurePowerInterruptionLayers() {
      if (!this.map || this.map.getSource(POWER_INTERRUPTION_SOURCE_ID)) {
        return;
      }

      this.map.addSource(POWER_INTERRUPTION_SOURCE_ID, {
        type: 'geojson',
        data: this.emptyFeatureCollection(),
      });

      this.map.addSource(POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID, {
        type: 'geojson',
        data: this.emptyFeatureCollection(),
      });

      this.map.addLayer({
        id: POWER_INTERRUPTION_HALO_LAYER_ID,
        type: 'line',
        source: POWER_INTERRUPTION_SOURCE_ID,
        filter: ['==', ['get', 'draw_border'], true],
        paint: {
          'line-color': ['match', ['get', 'interruption_type'], 'emergency', '#FCA5A5', '#FCD34D'],
          'line-width': ['match', ['get', 'interruption_type'], 'emergency', 8, 7],
          'line-opacity': 0.18,
          'line-dasharray': ['match', ['get', 'interruption_type'], 'scheduled', ['literal', [2, 1.5]], ['literal', [1, 0]]],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      this.map.addLayer({
        id: POWER_INTERRUPTION_FILL_LAYER_ID,
        type: 'fill',
        source: POWER_INTERRUPTION_SOURCE_ID,
        paint: {
          'fill-color': ['match', ['get', 'interruption_type'], 'emergency', '#EF4444', '#F59E0B'],
          'fill-opacity': 0.16,
        },
      });

      this.map.addLayer({
        id: POWER_INTERRUPTION_LINE_LAYER_ID,
        type: 'line',
        source: POWER_INTERRUPTION_SOURCE_ID,
        filter: ['==', ['get', 'draw_border'], true],
        paint: {
          'line-color': ['match', ['get', 'interruption_type'], 'emergency', '#DC2626', '#B45309'],
          'line-width': ['match', ['get', 'interruption_type'], 'emergency', 2.6, 2.2],
          'line-opacity': 0.86,
          'line-dasharray': ['match', ['get', 'interruption_type'], 'scheduled', ['literal', [2, 1.4]], ['literal', [1, 0]]],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      this.map.addLayer({
        id: POWER_INTERRUPTION_HIGHLIGHT_FILL_LAYER_ID,
        type: 'fill',
        source: POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID,
        paint: {
          'fill-color': ['match', ['get', 'interruption_type'], 'emergency', '#F87171', '#FBBF24'],
          'fill-opacity': 0.24,
        },
      });

      this.map.addLayer({
        id: POWER_INTERRUPTION_HIGHLIGHT_LINE_LAYER_ID,
        type: 'line',
        source: POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID,
        filter: ['==', ['get', 'draw_border'], true],
        paint: {
          'line-color': ['match', ['get', 'interruption_type'], 'emergency', '#B91C1C', '#92400E'],
          'line-width': ['match', ['get', 'interruption_type'], 'emergency', 3.1, 2.8],
          'line-opacity': 0.96,
          'line-dasharray': ['match', ['get', 'interruption_type'], 'scheduled', ['literal', [2, 1.2]], ['literal', [1, 0]]],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      this.map.on('mouseenter', POWER_INTERRUPTION_FILL_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', POWER_INTERRUPTION_FILL_LAYER_ID, () => {
        this.map.getCanvas().style.cursor = '';
        this.clearHoveredInterruption();
      });

      this.map.on('mousemove', POWER_INTERRUPTION_FILL_LAYER_ID, (event) => {
        const feature = event.features && event.features[0];
        if (!feature) {
          this.clearHoveredInterruption();
          return;
        }

        this.setHoveredInterruption(feature.properties.interruption_key);
      });

      this.map.on('click', POWER_INTERRUPTION_FILL_LAYER_ID, (event) => {
        const feature = event.features && event.features[0];
        if (!feature) {
          return;
        }

        this.openInterruptionPopup(event.lngLat, feature.properties.popup_html, feature.properties.interruption_key);
      });

      this.bringTicketLayersToFront();
    },
    bringTicketLayersToFront() {
      if (!this.mapLoaded || !this.map) {
        return;
      }

      [
        TICKET_CLUSTER_LAYER_ID,
        TICKET_CLUSTER_COUNT_LAYER_ID,
        TICKET_POINT_LAYER_ID,
      ].forEach((layerId) => {
        if (this.map.getLayer(layerId)) {
          this.map.moveLayer(layerId);
        }
      });
    },
    async getAllTickets() {
      this.$store.commit('setLoading', true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/ticket/get_all_ticket?from=${this.date1}&to=${this.date2}&status=0&area=${this.areaModel || 0}`
        );
        const data = await response.json();
        this.tickets = data.all_ticket || [];
        this.renderTicketMarkers();
      } catch (error) {
        console.error('Error fetching consumer tickets:', error);
        this.tickets = [];
        this.clearTicketMarkers();
      }

      try {
        await this.getPowerInterruptionOverlays();
      } finally {
        this.fitToVisibleData();
        this.$store.commit('setLoading', false);
      }
    },
    clearTicketMarkers() {
      if (this.activeTicketPopup) {
        this.activeTicketPopup.remove();
        this.activeTicketPopup = null;
      }

      if (this.mapLoaded && this.map && this.map.getSource(TICKET_SOURCE_ID)) {
        this.map.getSource(TICKET_SOURCE_ID).setData(this.emptyFeatureCollection());
      }
    },
    renderTicketMarkers() {
      if (!this.mapLoaded || !this.map || !this.map.getSource(TICKET_SOURCE_ID)) {
        return;
      }

      this.map.getSource(TICKET_SOURCE_ID).setData(this.buildTicketGeoJson());
      this.bringTicketLayersToFront();
    },
    buildTicketGeoJson() {
      return {
        type: 'FeatureCollection',
        features: this.tickets
          .filter((ticket) => ticket.location && ticket.location.coordinates)
          .map((ticket) => ({
            type: 'Feature',
            id: String(ticket.ticket_no),
            properties: {
              ticket_no: ticket.ticket_no,
              status: ticket.status,
              marker_color: this.getTicketMarkerColor(ticket.status),
              popup_html: this.generateTicketPopup(ticket),
            },
            geometry: {
              type: 'Point',
              coordinates: [ticket.location.coordinates[0], ticket.location.coordinates[1]],
            },
          })),
      };
    },
    openTicketPopup(feature) {
      const coordinates = feature.geometry && feature.geometry.coordinates;
      if (!coordinates) {
        return;
      }

      if (this.activeTicketPopup) {
        this.activeTicketPopup.remove();
      }

      this.activeTicketPopup = new maplibregl.Popup({
        offset: 14,
        maxWidth: '260px',
      })
        .setLngLat(coordinates)
        .setHTML(feature.properties.popup_html || '')
        .addTo(this.map);
    },
    getTicketMarkerColor(status) {
      if (status == 1) return '#E53935';
      if (status == 6) return '#FBC02D';
      if (status == 8) return '#1E88E5';
      if (status == 4) return '#26A69A';
      if (status == 9) return '#8E24AA';
      return '#9E9E9E';
    },
    getTicketStatusLabel(status) {
      if (status == 1) return 'Open';
      if (status == 6) return 'Acknowledged';
      if (status == 8) return 'Troubleshooting';
      if (status == 4) return 'Resolved';
      if (status == 9) return 'Reopened';
      return 'Closed';
    },
    getConsumerTicketArea(ticket) {
      const parts = [];

      if (ticket.barangay) parts.push(ticket.barangay);
      if (ticket.cfbarangay) parts.push(ticket.cfbarangay);
      if (ticket.town_name) parts.push(ticket.town_name);
      if (ticket.cftown) parts.push(ticket.cftown);

      const unique = parts.filter((value, index) => value && parts.indexOf(value) === index);
      if (unique.length) {
        return unique.join(', ');
      }

      if (ticket.address) {
        const addressParts = ticket.address
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean);

        if (addressParts.length >= 2) {
          return addressParts.slice(-2).join(', ');
        }

        if (addressParts.length === 1) {
          return addressParts[0];
        }
      }

      return this.selectedAreaLabel;
    },
    generateTicketPopup(ticket) {
      const createdAt = new Date(ticket.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      let html = `
        <div class="consumer-public-popup">
          <div class="consumer-public-popup-title">Ticket ${this.escapeHtml(ticket.ticket_no.toString().padStart(7, '0'))}</div>
          <div class="consumer-public-popup-meta">Created ${this.escapeHtml(createdAt)}</div>
          <div class="consumer-public-popup-row"><b>Status:</b> ${this.escapeHtml(this.getTicketStatusLabel(ticket.status))}</div>
          <div class="consumer-public-popup-row"><b>Area:</b> ${this.escapeHtml(this.getConsumerTicketArea(ticket))}</div>
          <div class="consumer-public-popup-row"><b>Concern:</b> ${this.escapeHtml(ticket.message || 'No details provided.')}</div>
      `;

      if (ticket.remarks) {
        html += `<div class="consumer-public-popup-row"><b>Remarks:</b> ${this.escapeHtml(ticket.remarks)}</div>`;
      }

      html += '</div>';
      return html;
    },
    async getPowerInterruptionOverlays() {
      if (!this.powerInterruptionApiBase) {
        this.powerInterruptions = [];
        this.clearPowerInterruptionOverlays();
        return;
      }

      try {
        const response = await axios.get(`${this.powerInterruptionApiBase}/api/power-interruptions/consumer-map`, {
          params: {
            area_office_id: this.areaModel || 'all',
          },
        });

        this.powerInterruptions = response.data || [];
        await this.renderPowerInterruptionOverlays();
      } catch (error) {
        console.error('Error fetching power interruption overlays:', error);
        this.powerInterruptions = [];
        this.clearPowerInterruptionOverlays();
      }
    },
    async renderPowerInterruptionOverlays() {
      const geoJson = await this.buildPowerInterruptionGeoJson();
      this.powerInterruptionGeoJson = geoJson;

      if (!this.mapLoaded || !this.map || !this.map.getSource(POWER_INTERRUPTION_SOURCE_ID)) {
        return;
      }

      this.map.getSource(POWER_INTERRUPTION_SOURCE_ID).setData(geoJson);
      this.clearHoveredInterruption();
      this.setPowerInterruptionLayerVisibility();
      this.bringTicketLayersToFront();
      this.applyRouteInterruptionFocus();
    },
    clearPowerInterruptionOverlays() {
      this.powerInterruptionGeoJson = this.emptyFeatureCollection();

      if (this.mapLoaded && this.map && this.map.getSource(POWER_INTERRUPTION_SOURCE_ID)) {
        this.map.getSource(POWER_INTERRUPTION_SOURCE_ID).setData(this.emptyFeatureCollection());
      }

      this.clearHoveredInterruption();
    },
    async buildPowerInterruptionGeoJson() {
      if (!this.showPowerInterruptionOverlay || this.filteredPowerInterruptions.length === 0) {
        return this.emptyFeatureCollection();
      }

      const features = [];

      for (const interruption of this.filteredPowerInterruptions) {
        const geometries = await this.getPowerInterruptionGeometries(interruption);
        if (!geometries.length) {
          continue;
        }

        const geometryPieceCount = geometries.reduce((count, geometry) => {
          if (!geometry) {
            return count;
          }

          if (geometry.type === 'MultiPolygon') {
            return count + (geometry.coordinates ? geometry.coordinates.length : 0);
          }

          return count + 1;
        }, 0);

        const interruptionKey = String(interruption.id);
        const popupHtml = this.generatePowerInterruptionPopup(interruption);

        geometries.forEach((geometry, index) => {
          if (!geometry) {
            return;
          }

          features.push({
            type: 'Feature',
            id: `${interruptionKey}-${index}`,
            properties: {
              interruption_id: interruption.id,
              interruption_key: interruptionKey,
              interruption_type: interruption.interruption_type || 'scheduled',
              draw_border: geometryPieceCount <= 1,
              popup_html: popupHtml,
            },
            geometry,
          });
        });
      }

      return {
        type: 'FeatureCollection',
        features,
      };
    },
    async getPowerInterruptionGeometries(interruption) {
      if (['municipality', 'feeder', 'barangay'].includes(interruption.area_scope) && interruption.boundary_geometry) {
        try {
          return [
            typeof interruption.boundary_geometry === 'string'
              ? JSON.parse(interruption.boundary_geometry)
              : interruption.boundary_geometry,
          ];
        } catch (error) {
          console.error('Invalid power interruption boundary geometry:', error);
          return [];
        }
      }

      const areaOfficeId = interruption.area_scope === 'coverage' ? 0 : interruption.area_office_id;
      if (areaOfficeId === null || areaOfficeId === undefined || areaOfficeId === '') {
        return [];
      }

      const polygons = await this.getPowerInterruptionPolygon(areaOfficeId);
      return polygons.map((polygon) => polygon.geometry).filter(Boolean);
    },
    async getPowerInterruptionPolygon(areaOfficeId) {
      const cacheKey = String(areaOfficeId);
      if (this.powerInterruptionPolygonCache[cacheKey]) {
        return this.powerInterruptionPolygonCache[cacheKey];
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ticket/get_polygon/${areaOfficeId}`);
      const data = await response.json();
      const polygons = data.data || [];
      this.powerInterruptionPolygonCache[cacheKey] = polygons;
      return polygons;
    },
    setPowerInterruptionLayerVisibility() {
      if (!this.mapLoaded || !this.map) {
        return;
      }

      const visibility = this.showPowerInterruptionOverlay ? 'visible' : 'none';

      [
        POWER_INTERRUPTION_HALO_LAYER_ID,
        POWER_INTERRUPTION_FILL_LAYER_ID,
        POWER_INTERRUPTION_LINE_LAYER_ID,
        POWER_INTERRUPTION_HIGHLIGHT_FILL_LAYER_ID,
        POWER_INTERRUPTION_HIGHLIGHT_LINE_LAYER_ID,
      ].forEach((layerId) => {
        if (this.map.getLayer(layerId)) {
          this.map.setLayoutProperty(layerId, 'visibility', visibility);
        }
      });
    },
    togglePowerInterruptionOverlay() {
      this.showPowerInterruptionOverlay = !this.showPowerInterruptionOverlay;
      this.setPowerInterruptionLayerVisibility();

      if (!this.showPowerInterruptionOverlay) {
        this.clearHoveredInterruption();
        if (this.activeInterruptionPopup) {
          this.activeInterruptionPopup.remove();
          this.activeInterruptionPopup = null;
        }
      } else {
        this.renderPowerInterruptionOverlays();
      }
    },
    setHoveredInterruption(interruptionKey) {
      if (!this.mapLoaded || !this.map || !this.map.getSource(POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID)) {
        return;
      }

      if (!this.powerInterruptionGeoJson || !this.powerInterruptionGeoJson.features) {
        this.clearHoveredInterruption();
        return;
      }

      if (this.activeHoveredInterruptionKey === interruptionKey) {
        return;
      }

      this.activeHoveredInterruptionKey = interruptionKey;
      const features = this.powerInterruptionGeoJson.features.filter(
        (feature) => String(feature.properties.interruption_key) === String(interruptionKey)
      );

      this.map.getSource(POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID).setData({
        type: 'FeatureCollection',
        features,
      });
    },
    clearHoveredInterruption() {
      this.activeHoveredInterruptionKey = null;

      if (this.mapLoaded && this.map && this.map.getSource(POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID)) {
        this.map.getSource(POWER_INTERRUPTION_HIGHLIGHT_SOURCE_ID).setData(this.emptyFeatureCollection());
      }
    },
    openInterruptionPopup(lngLat, popupHtml, interruptionKey) {
      this.setHoveredInterruption(interruptionKey);
      this.focusedInterruptionId = interruptionKey;

      if (this.activeInterruptionPopup) {
        this.activeInterruptionPopup.remove();
      }

      this.activeInterruptionPopup = new maplibregl.Popup({
        closeOnClick: true,
        maxWidth: '290px',
      })
        .setLngLat(lngLat)
        .setHTML(popupHtml)
        .addTo(this.map);

      this.activeInterruptionPopup.on('close', () => {
        this.clearHoveredInterruption();
        this.activeInterruptionPopup = null;
      });
    },
    applyRouteInterruptionFocus() {
      if (!this.routeInterruptionId || !this.showPowerInterruptionOverlay) {
        return;
      }

      this.focusInterruptionById(this.routeInterruptionId);
    },
    focusInterruptionById(interruptionId) {
      if (!interruptionId || !this.mapLoaded || !this.map || !this.powerInterruptionGeoJson || !this.powerInterruptionGeoJson.features) {
        return false;
      }

      if (String(this.focusedInterruptionId) === String(interruptionId) && this.activeInterruptionPopup) {
        return true;
      }

      const features = this.powerInterruptionGeoJson.features.filter(
        (feature) => String(feature.properties.interruption_key) === String(interruptionId)
      );

      if (!features.length) {
        return false;
      }

      const bounds = new maplibregl.LngLatBounds();
      let hasBounds = false;

      features.forEach((feature) => {
        hasBounds = this.extendBoundsWithGeometry(bounds, feature.geometry) || hasBounds;
      });

      if (hasBounds) {
        this.map.fitBounds(bounds, {
          padding: 56,
          duration: 700,
          maxZoom: 14,
        });
      }

      const popupHtml = features[0].properties.popup_html || '';
      const popupCenter = hasBounds ? bounds.getCenter() : DEFAULT_CENTER;
      this.openInterruptionPopup(popupCenter, popupHtml, String(interruptionId));
      return true;
    },
    fitToVisibleData() {
      if (!this.mapLoaded || !this.map) {
        return;
      }

      const bounds = new maplibregl.LngLatBounds();
      let hasBounds = false;

      this.tickets.forEach((ticket) => {
        if (!ticket.location || !ticket.location.coordinates) {
          return;
        }

        bounds.extend([ticket.location.coordinates[0], ticket.location.coordinates[1]]);
        hasBounds = true;
      });

      if (this.showPowerInterruptionOverlay && this.powerInterruptionGeoJson && this.powerInterruptionGeoJson.features.length > 0) {
        this.powerInterruptionGeoJson.features.forEach((feature) => {
          hasBounds = this.extendBoundsWithGeometry(bounds, feature.geometry) || hasBounds;
        });
      }

      if (hasBounds) {
        this.map.fitBounds(bounds, {
          padding: 40,
          duration: 700,
        });
      } else {
        this.map.easeTo({
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          duration: 600,
        });
      }
    },
    extendBoundsWithGeometry(bounds, geometry) {
      if (!geometry || !geometry.coordinates) {
        return false;
      }

      let extended = false;

      const extendCoordinate = (coord) => {
        if (!Array.isArray(coord) || coord.length < 2 || typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
          coord.forEach(extendCoordinate);
          return;
        }

        bounds.extend([coord[0], coord[1]]);
        extended = true;
      };

      extendCoordinate(geometry.coordinates);
      return extended;
    },
    generatePowerInterruptionPopup(interruption) {
      const schedule = `${this.formatInterruptionDateTime(interruption.start_at)}${
        interruption.end_at ? ` to ${this.formatInterruptionDateTime(interruption.end_at)}` : ''
      }`;
      const reason = interruption.reason || interruption.cause || '';
      const affectedBarangays = this.formatInterruptionBarangaySummary(interruption.affected_barangays);
      const affectedArea = interruption.affected_area || interruption.municipality_names || interruption.municipality || '';

      return `
        <div class="consumer-public-popup">
          <div class="consumer-public-popup-title">${this.escapeHtml(interruption.title || 'Power Interruption')}</div>
          <div class="consumer-public-popup-row"><b>Schedule:</b> ${this.escapeHtml(schedule || 'Open ended')}</div>
          ${reason ? `<div class="consumer-public-popup-row"><b>Reason:</b> ${this.formatInterruptionText(reason)}</div>` : ''}
          ${affectedArea ? `<div class="consumer-public-popup-row"><b>Affected Area:</b> ${this.formatInterruptionText(affectedArea)}</div>` : ''}
          ${affectedBarangays ? `<div class="consumer-public-popup-row"><b>Affected Barangays:</b> ${affectedBarangays}</div>` : ''}
        </div>
      `;
    },
    formatInterruptionScope(scope) {
      switch ((scope || '').toLowerCase()) {
        case 'coverage':
          return 'Entire Coverage';
        case 'municipality':
          return 'Municipality';
        case 'barangay':
          return 'Barangay';
        case 'feeder':
          return 'Feeder';
        default:
          return scope || 'Coverage';
      }
    },
    formatInterruptionDateTime(value) {
      if (!value) {
        return '';
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    },
    formatInterruptionBarangaySummary(value) {
      if (!value) {
        return '';
      }

      const rawItems = value
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

      const uniqueItems = rawItems.filter((item, index) => rawItems.indexOf(item) === index);
      if (!uniqueItems.length) {
        return '';
      }

      const preview = uniqueItems.slice(0, 4).map((item) => this.escapeHtml(item)).join(', ');
      if (uniqueItems.length <= 4) {
        return preview;
      }

      const remaining = uniqueItems.length - 4;
      return `${preview}, and ${remaining} more`;
    },
    formatInterruptionText(value) {
      return this.escapeHtml(value).replace(/\n/g, '<br>');
    },
    escapeHtml(value) {
      return (value || '')
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },
    submitTicket() {
      this.$router.push({ name: 'ReportBrownout' });
    },
  },
};
</script>

<style scoped>
.consumer-public-map-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(8, 25, 43, 0.22) 0%, rgba(8, 25, 43, 0.04) 22%, rgba(8, 25, 43, 0) 40%),
    linear-gradient(0deg, rgba(8, 25, 43, 0.18) 0%, rgba(8, 25, 43, 0.02) 24%, rgba(8, 25, 43, 0) 42%);
}

.consumer-public-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(18px);
}

.consumer-public-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #375168;
}

.consumer-public-title {
  color: #162f45;
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.14;
}

.consumer-public-copy {
  color: #51697c;
  font-size: 0.88rem;
  line-height: 1.45;
  max-width: 32rem;
}

.consumer-public-guide-title {
  color: #18334a;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.25;
}

.consumer-public-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 1.9rem;
  padding: 0.28rem 0.72rem;
  border-radius: 999px;
  background: rgba(236, 243, 248, 0.96);
  border: 1px solid rgba(187, 203, 213, 0.95);
  color: #24455f;
  font-size: 0.78rem;
  font-weight: 600;
}

.consumer-public-chip--action {
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.consumer-public-chip--action:hover {
  background: rgba(228, 238, 245, 0.98);
  border-color: rgba(105, 142, 173, 0.7);
  transform: translateY(-1px);
}

.consumer-public-chip-icon,
.consumer-public-icon {
  width: 0.92rem;
  height: 0.92rem;
  flex: 0 0 auto;
}

.consumer-public-icon-btn,
.consumer-public-primary-btn {
  border: 0;
  outline: none;
}

.consumer-public-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.45rem;
  height: 2.45rem;
  border-radius: 999px;
  background: rgba(248, 251, 253, 0.98);
  border: 1px solid rgba(190, 204, 214, 0.95);
  color: #173a55;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.consumer-public-icon-btn:hover {
  background: #ffffff;
  border-color: rgba(96, 132, 162, 0.8);
  transform: translateY(-1px);
}

.consumer-public-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 2.5rem;
  padding: 0.68rem 0.95rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0f5fa8 0%, #0d7cc3 100%);
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 700;
  box-shadow: 0 16px 32px rgba(13, 95, 168, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.consumer-public-primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(13, 95, 168, 0.32);
  filter: saturate(1.04);
}

.consumer-public-legend-title {
  margin-bottom: 0.6rem;
  color: #4c6579;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.consumer-public-legend-grid {
  display: grid;
  gap: 0.6rem 0.9rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.consumer-public-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #1f3e57;
  font-size: 0.78rem;
  font-weight: 600;
}

.consumer-public-dot,
.consumer-public-swatch {
  width: 0.82rem;
  height: 0.82rem;
  flex: 0 0 auto;
}

.consumer-public-dot {
  border-radius: 999px;
}

.consumer-public-swatch {
  border-radius: 0.28rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.consumer-public-popup {
  color: #22384b;
  font-size: 0.88rem;
  line-height: 1.45;
}

.consumer-public-popup-title {
  color: #142c40;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.consumer-public-popup-meta {
  color: #61778a;
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
}

.consumer-public-popup-row + .consumer-public-popup-row {
  margin-top: 0.4rem;
}

::v-deep .maplibregl-popup-content {
  border-radius: 0.95rem;
  padding: 0.9rem 1rem;
  font-family: inherit;
}

::v-deep .maplibregl-popup-close-button {
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 999px;
  font-size: 1.1rem;
  line-height: 1;
  color: #4b6478;
  background: rgba(236, 243, 248, 0.9);
  border: 1px solid rgba(187, 203, 213, 0.8);
  cursor: pointer;
  transition: background-color 0.15s;
}

::v-deep .maplibregl-popup-close-button:hover {
  background: rgba(215, 228, 237, 1);
  color: #1f3e57;
}

.consumer-public-filter-tab {
  padding: 0.22rem 0.7rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  background: rgba(236, 243, 248, 0.96);
  border: 1px solid rgba(187, 203, 213, 0.95);
  color: #24455f;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}

.consumer-public-filter-tab--active {
  background: #0f5fa8;
  border-color: #0f5fa8;
  color: #ffffff;
}

@media (max-width: 767px) {
  .consumer-public-title {
    font-size: 1rem;
    margin-top: 0.2rem;
  }

  .consumer-public-copy {
    font-size: 0.82rem;
  }

  .consumer-public-eyebrow {
    font-size: 0.62rem;
  }

  .consumer-public-chip {
    min-height: 1.65rem;
    padding: 0.18rem 0.56rem;
    font-size: 0.7rem;
  }

  .consumer-public-icon-btn {
    width: 2.05rem;
    height: 2.05rem;
  }

  .consumer-public-primary-btn {
    min-height: 2.15rem;
    padding: 0.52rem 0.78rem;
    font-size: 0.76rem;
  }

  .consumer-public-legend-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
