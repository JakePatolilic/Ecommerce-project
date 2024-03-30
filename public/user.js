document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.category').forEach(categoryDiv => {
        categoryDiv.addEventListener('click', () => {
            const category = categoryDiv.textContent.trim();
            window.location.href = `userProduct?category=${encodeURIComponent(category)}`;
        });
    });

    const logoButton = document.getElementById('logoBtn');
    logoButton.addEventListener('click', () => {
        // Navigate to the user page
        window.location.href = 'userPage';
    })
});
