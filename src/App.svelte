<script>
  import { version } from '../package.json';

  import 'bootstrap/dist/css/bootstrap.min.css';
  import { InfoCircle } from "svelte-bootstrap-icons";

  import IntegrationService from './actions/IntegrationService';
  import ConnectionList from './components/ConnectionList.svelte';

  let token = $state('');
  let loaded = $derived(!!token);

  let connections = $state([]);

  $effect(() => {
    if (!loaded && window.loadedEvent) {
      const data = window.loadedEvent
      triggerLoad(data.token)
    }
  });

  async function triggerLoad(jwtToken, projectId, subProjectId) {
    IntegrationService.setJWT(jwtToken)
    IntegrationService.setProject(projectId, subProjectId)
    connections = await IntegrationService.getConnections()
    token = jwtToken
  }

  function onWindowMessage(msg) {
    if (!loaded && msg.data?.event === 'loaded') {
      triggerLoad(msg.data.token, msg.data.project, msg.data.subProject)
    }
    if (!msg.data.isFrameActive) {
      return
    }
  }
</script>

<svelte:window on:message={onWindowMessage} />

<main class="app" style="padding: 20px 80px; padding-bottom: 180px;">
  {#if loaded}
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <ConnectionList {connections} />
        </div>
      </div>
    </div>
  {:else}
    <div class="container mt-4">
      <div class="alert alert-info" role="alert">
        Waiting for integration to load...
      </div>
    </div>
  {/if}

  <div class="footer-container bg-dark text-secondary mt-3">
    <div class="container mt-3">
      <div class="mt-3">
        <div class="text-end small"><InfoCircle />v{version}, Powered by <a href="https://api.fieldtwin.com/" target="_blank"><img src="https://avatars.githubusercontent.com/u/12692713?s=48&v=4" alt="" class="img-thumbnail" style="height:25px" title="FieldTwin API"></a>
        </div>
      </div>
    </div>
  </div>
</main>

<style>

</style>