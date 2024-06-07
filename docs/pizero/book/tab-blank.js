<script>
$(function(){
  $("a[href^='http']:not([href*='" + location.hostname + "'])").attr('target', '_blank');
})
</script>