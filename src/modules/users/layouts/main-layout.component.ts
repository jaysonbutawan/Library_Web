import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/nav-bar.component';

@Component({
    selector: 'admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent,RouterModule],
    templateUrl: './main-layout.component.html',
})
export class UserLayoutComponent {
    isMobileMenuOpen = false;
    private touchStartX = 0;

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    swipeStart(event: TouchEvent) {
        this.touchStartX = event.changedTouches[0].screenX;
    }

    swipeEnd(event: TouchEvent) {
        const touchEndX = event.changedTouches[0].screenX;
        if (this.touchStartX - touchEndX > 50) {
            this.isMobileMenuOpen = false;
        }
    }

    @HostListener('window:keydown.escape', ['$event'])
    handleKeyDown(event: any) {
        if (this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
        }
    }

    closeMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
