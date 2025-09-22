<script>
  /**
   * ConnectionList component displays a list of connections with their basic information
   * 
   * @component
   */

  /**
   * SubProject data containing connections
   * @type {Object}
   */
  const { connections = {} } = $props();

</script>

<div class="connection-list-container">
  <h3 class="mb-4">Connections</h3>
  
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
          </tr>
        </thead>
        <tbody>
          {#each Object.values(connections) as connection (connection.id)}
            <tr>
              <td>{connection.id}</td>
              <td>{connection.params?.type || 'N/A'}</td>
              <td>{connection.params?.label || 'N/A'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
</style>