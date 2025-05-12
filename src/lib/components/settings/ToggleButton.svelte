<script lang="ts">
  interface Props {
    toggle: boolean;
    title: string;
    accentColor?: string;
  }

  let { toggle = $bindable(), title, accentColor = 'var(--color-rosePineDawn-pine)' }: Props = $props();
</script>

<button class="toggle-button" class:selected={toggle} onclick={() => (toggle = !toggle)} style="--accent-color: {accentColor}">
  {title}
</button>
