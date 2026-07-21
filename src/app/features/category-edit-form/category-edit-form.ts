import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm {
  viewMode: 'form' | 'list' = 'form';

  onSubmit() {
    throw new Error('Method not implemented.');
  }
  selectedId!: string | null;
  private activatedRoutes = inject(ActivatedRoute)
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.selectedId = this.activatedRoutes.snapshot.paramMap.get('id');
  }
}
