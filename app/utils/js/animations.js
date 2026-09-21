function toggleLikeButton(mem_id, state) {
    const btn = document.getElementById('like-btn-' + mem_id)
    btn.classList.remove('disable', 'enable')
    btn.classList.add(state)
}
