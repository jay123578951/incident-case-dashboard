export const useTempMarker = (map, emit) => {
  const tempMarker = ref(null);

  /**
   * 設置臨時 Marker
   * @param {Object} location - 包含 lat 和 lng 的物件
   * @param {string} popupText - Popup 顯示文字
   */
  const setTempMarker = (location, popupText) => {
    if (!map.value) return;

    if (!window.L) {
      console.error('Leaflet 未載入');
      return;
    }

    map.value.flyTo([location.lat, location.lng], 18);

    if (tempMarker.value) {
      map.value.removeLayer(tempMarker.value);
      tempMarker.value = null;
    }

    tempMarker.value = window.L.marker([location.lat, location.lng], {
      draggable: true,
      icon: window.L.icon({
        iconUrl: '/images/pin-new.svg',
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
    }).addTo(map.value);

    if (popupText) {
      tempMarker.value.bindPopup(popupText).openPopup();
    }

    // dragend: 拖曳結束時觸發
    tempMarker.value.on('dragend', (e) => {
      // 將新的位置信息傳遞給父組件
      emit('mapClick', e.target.getLatLng());
    });
  };

  return { setTempMarker };
};
