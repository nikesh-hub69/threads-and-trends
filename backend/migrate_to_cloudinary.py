# interactive_image_assignment.py
# Interactively assign images to products

import os
import django # type: ignore
import glob

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Product, ProductImage
from django.core.files import File # type: ignore
from django.conf import settings # type: ignore

def list_available_images():
    """Show all available image files"""
    products_dir = os.path.join(settings.MEDIA_ROOT, 'products')
    
    if not os.path.exists(products_dir):
        print(f"❌ Directory not found: {products_dir}")
        return []
    
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP']
    files = []
    
    for ext in extensions:
        files.extend(glob.glob(os.path.join(products_dir, ext)))
    
    return sorted(files)

def interactive_assignment():
    print("🎯 Interactive Image Assignment\n")
    print("="*80)
    
    # Get all products
    products = Product.objects.all().order_by('name')
    
    # Get available images
    available_images = list_available_images()
    
    print(f"\n📁 Available images ({len(available_images)}):")
    for i, img_path in enumerate(available_images, 1):
        filename = os.path.basename(img_path)
        print(f"   {i}. {filename}")
    
    print(f"\n🛍️  Products ({products.count()}):\n")
    
    for product in products:
        print("="*80)
        print(f"📦 Product: {product.name}")
        
        # Show current image if exists
        current_images = ProductImage.objects.filter(product=product)
        if current_images.exists():
            print(f"   Current: {current_images.first().image.name}")
        
        print("\nAvailable images:")
        for i, img_path in enumerate(available_images, 1):
            filename = os.path.basename(img_path)
            print(f"   {i}. {filename}")
        
        choice = input(f"\nEnter image number for '{product.name}' (or 'skip'): ").strip()
        
        if choice.lower() == 'skip':
            print("⏭️  Skipped")
            continue
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(available_images):
                img_path = available_images[idx]
                filename = os.path.basename(img_path)
                
                # Delete existing images
                ProductImage.objects.filter(product=product).delete()
                
                # Upload new image
                print(f"📤 Uploading {filename}...", end=" ")
                
                with open(img_path, 'rb') as f:
                    product_image = ProductImage(product=product, is_main=True)
                    product_image.image.save(filename, File(f), save=True)
                
                print("✅")
                
            else:
                print("❌ Invalid number")
        except ValueError:
            print("❌ Invalid input")
        
        print()
    
    print("="*80)
    print("✅ Done! Restart Django and check your frontend.")

if __name__ == "__main__":
    response = input("⚠️  This will reassign images. Continue? (yes/no): ").strip().lower()
    if response == 'yes':
        interactive_assignment()
    else:
        print("❌ Cancelled")