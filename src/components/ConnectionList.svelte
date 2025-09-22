<script>
  /**
   * ConnectionList component displays a list of connections with their basic information
   * and allows comparing metadata between selected connections
   * 
   * @component
   */

  /**
   * SubProject data containing connections
   * @type {Object}
   */
  const { connections = {} } = $props();

  // State for comparison functionality
  let selectedConnections = $state([]);
  let showComparison = $derived(selectedConnections.length === 2);
  let isLoading = $state(false);

  /**
   * Add connection to comparison
   * @param {Object} connection - Connection to add
   */
  function addToCompare(connection) {
    if (selectedConnections.length >= 2) {
      // Remove first connection when adding third (BR001)
      selectedConnections = [selectedConnections[1], connection];
    } else {
      selectedConnections = [...selectedConnections, connection];
    }
  }

  /**
   * Remove connection from comparison
   * @param {string} connectionId - ID of connection to remove
   */
  function removeFromCompare(connectionId) {
    selectedConnections = selectedConnections.filter(conn => conn.id !== connectionId);
  }

  /**
   * Clear all selected connections
   */
  function clearSelection() {
    selectedConnections = [];
  }

  /**
   * Check if connection is selected
   * @param {string} connectionId - Connection ID to check
   * @returns {boolean}
   */
  function isSelected(connectionId) {
    return selectedConnections.some(conn => conn.id === connectionId);
  }

  /**
   * Compare metadata between two connections
   * @returns {Array} Array of comparison objects
   */
  function compareMetadata() {
    if (selectedConnections.length !== 2) return [];
    
    const [conn1, conn2] = selectedConnections;
    const comparison = [];
    
    // Get all unique property keys from both connections
    const allKeys = new Set([
      ...Object.keys(conn1.params || {}),
      ...Object.keys(conn2.params || {}),
      ...Object.keys(conn1).filter(key => key !== 'params'),
      ...Object.keys(conn2).filter(key => key !== 'params')
    ]);

    allKeys.forEach(key => {
      let value1, value2;
      
      // Handle params properties and direct properties
      if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
        value1 = conn1[key];
        value2 = conn2[key];
      } else {
        value1 = conn1.params?.[key];
        value2 = conn2.params?.[key];
      }

      // Convert values to strings for comparison
      const str1 = value1 !== undefined ? String(value1) : 'N/A';
      const str2 = value2 !== undefined ? String(value2) : 'N/A';
      
      let status;
      if (value1 === undefined && value2 !== undefined) {
        status = 'added';
      } else if (value1 !== undefined && value2 === undefined) {
        status = 'removed';
      } else if (str1 !== str2) {
        status = 'changed';
      } else {
        status = 'same';
      }

      comparison.push({
        property: key,
        value1: str1,
        value2: str2,
        status
      });
    });

    return comparison.sort((a, b) => a.property.localeCompare(b.property));
  }

  let comparisonData = $derived(compareMetadata());
</script>

<div class="connection-list-container">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h3 class="mb-0">Connections</h3>
    {#if selectedConnections.length > 0}
      <div class="d-flex align-items-center gap-3">
        <span class="badge bg-primary fs-6">{selectedConnections.length} connection{selectedConnections.length === 1 ? '' : 's'} selected</span>
        <button class="btn btn-outline-secondary btn-sm" onclick={clearSelection}>
          Clear Selection
        </button>
      </div>
    {/if}
  </div>
  
  {#if Object.keys(connections).length === 0}
    <div class="alert alert-info" role="alert">
      No connections available.
    </div>
  {:else}
    <div class="table-responsive" style="max-height: 400px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem;">
      <table class="table table-striped table-hover mb-0">
        <thead class="table-dark sticky-top">
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Label</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each Object.values(connections) as connection (connection.id)}
            <tr class={isSelected(connection.id) ? 'table-success' : ''}>
              <td>{connection.id}</td>
              <td>{connection.params?.type || 'N/A'}</td>
              <td>{connection.params?.label || 'N/A'}</td>
              <td>
                {#if isSelected(connection.id)}
                  <button 
                    class="btn btn-outline-danger btn-sm"
                    onclick={() => removeFromCompare(connection.id)}
                  >
                    Remove
                  </button>
                {:else}
                  <button 
                    class="btn btn-primary btn-sm"
                    onclick={() => addToCompare(connection)}
                    disabled={selectedConnections.length >= 2}
                  >
                    Add to Compare
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if selectedConnections.length === 1}
      <div class="alert alert-info mt-3" role="alert">
        <strong>Select one more connection to compare metadata.</strong>
      </div>
    {/if}

    {#if showComparison}
      <div class="mt-4">
        <h4 class="mb-3">Metadata Comparison</h4>
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <strong>Connection 1: {selectedConnections[0].params?.label || selectedConnections[0].id}</strong>
              </div>
              <div class="card-body">
                <small class="text-muted">ID: {selectedConnections[0].id}</small><br>
                <small class="text-muted">Type: {selectedConnections[0].params?.type || 'N/A'}</small>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header bg-secondary text-white">
                <strong>Connection 2: {selectedConnections[1].params?.label || selectedConnections[1].id}</strong>
              </div>
              <div class="card-body">
                <small class="text-muted">ID: {selectedConnections[1].id}</small><br>
                <small class="text-muted">Type: {selectedConnections[1].params?.type || 'N/A'}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive" style="max-height: 500px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem;">
          <table class="table table-sm mb-0">
            <thead class="table-dark sticky-top">
              <tr>
                <th>Property</th>
                <th>Connection 1 Value</th>
                <th>Connection 2 Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {#each comparisonData as item (item.property)}
                <tr class={
                  item.status === 'same' ? '' :
                  item.status === 'changed' ? 'table-warning' :
                  item.status === 'added' ? 'table-success' :
                  item.status === 'removed' ? 'table-danger' : ''
                }>
                  <td><strong>{item.property}</strong></td>
                  <td>
                    <span class={item.status === 'removed' ? 'text-decoration-line-through text-muted' : ''}>
                      {item.value1}
                    </span>
                  </td>
                  <td>
                    <span class={item.status === 'added' ? 'fw-bold text-success' : ''}>
                      {item.value2}
                    </span>
                  </td>
                  <td>
                    {#if item.status === 'same'}
                      <span class="badge bg-light text-dark">Same</span>
                    {:else if item.status === 'changed'}
                      <span class="badge bg-warning">Changed</span>
                    {:else if item.status === 'added'}
                      <span class="badge bg-success">Added</span>
                    {:else if item.status === 'removed'}
                      <span class="badge bg-danger">Removed</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        {#if comparisonData.length === 0}
          <div class="alert alert-info mt-3" role="alert">
            No metadata properties found to compare.
          </div>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .connection-list-container {
    width: 100%;
  }
  
  .table-responsive {
    border-radius: 0.375rem;
  }
  
  .sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  @media (max-width: 768px) {
    .d-flex.justify-content-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .d-flex.align-items-center.gap-3 {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>