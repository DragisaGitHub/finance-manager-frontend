import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CVRequest, CVsService, EntityModelCVResponse } from '../../api';
import { DatePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  standalone: true,
  styleUrls: ['./cv.component.scss'],
  imports: [
    NgForOf,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    NgIf,
    NgOptimizedImage,
    DatePipe,
  ],
})
export class CVComponent implements OnInit {
  cvs: EntityModelCVResponse[] = [];
  selectedCV: CVRequest | null = null;
  cvForm: FormGroup;
  isEditing: boolean = false;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private cvService: CVsService,
    private fb: FormBuilder,
  ) {
    this.cvForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: [''],
      summary: [''],
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      socialLinks: this.fb.array([]),
      skills: [''],
      languages: [''],
    });
  }

  ngOnInit(): void {
    this.fetchCVs();
  }

  fetchCVs() {
    this.cvService.getAllCVs().subscribe({
      next: async (response) => {
        this.cvs = await this.parseTransactionsResponse(response);
      },
      error: (error) => console.error('Error fetching CVs:', error),
    });
  }

  private async parseTransactionsResponse(
    response: any,
  ): Promise<EntityModelCVResponse[]> {
    if (response instanceof Blob) {
      const text = await response.text();
      const jsonResponse = JSON.parse(text);
      return this.processCVs(jsonResponse._embedded?.cVResponseList || []);
    }
    return this.processCVs(response._embedded?.cVResponseList || []);
  }

  private processCVs(cvs: any[]): EntityModelCVResponse[] {
    return cvs.map((cv) => ({
      ...cv,
      profileImage: cv.profileImage
        ? `data:image/png;base64,${cv.profileImage}`
        : null,
    }));
  }

  onAddCV() {
    this.isEditing = false;
    this.cvForm.reset();
    this.selectedCV = null;
  }

  onEditCV(cv: EntityModelCVResponse) {
    this.isEditing = true;
    this.selectedCV = { ...cv };
    this.cvForm.patchValue({
      fullName: cv.fullName,
      email: cv.email,
      phoneNumber: cv.phoneNumber,
      address: cv.address,
      summary: cv.summary,
      skills: cv.skills,
      languages: cv.languages,
    });
    this.setEducations(cv.educations || []);
    this.setExperiences(cv.experiences || []);
    this.setSocialLinks(cv.socialLinks || []);
  }

  private setEducations(educations: any[]) {
    const educationArray = this.cvForm.get('educations') as FormArray;
    educationArray.clear(); // Clear existing form array
    educations.forEach((education) => {
      educationArray.push(
        this.fb.group({
          degree: [education.degree, Validators.required],
          institution: [education.institution, Validators.required],
          startDate: [education.startDate, Validators.required],
          endDate: [education.endDate],
        }),
      );
    });
  }

  private setExperiences(experiences: any[]) {
    const experienceArray = this.cvForm.get('experiences') as FormArray;
    experienceArray.clear(); // Clear existing form array
    experiences.forEach((experience) => {
      experienceArray.push(
        this.fb.group({
          position: [experience.position, Validators.required],
          company: [experience.company, Validators.required],
          startDate: [experience.startDate, Validators.required],
          endDate: [experience.endDate],
          description: [experience.description],
        }),
      );
    });
  }

  private setSocialLinks(socialLinks: any[]) {
    const socialLinkArray = this.cvForm.get('socialLinks') as FormArray;
    socialLinkArray.clear(); // Clear existing form array
    socialLinks.forEach((link) => {
      socialLinkArray.push(
        this.fb.group({
          platform: [link.platform, Validators.required],
          url: [link.url, Validators.required],
          iconClass: [link.iconClass],
        }),
      );
    });
  }

  onSubmit() {
    if (this.cvForm.valid) {
      const cvRequest: CVRequest = {
        ...this.cvForm.value,
        skills: Array.isArray(this.cvForm.value.skills)
          ? this.cvForm.value.skills
          : [this.cvForm.value.skills],
        languages: Array.isArray(this.cvForm.value.languages)
          ? this.cvForm.value.languages
          : [this.cvForm.value.languages],
      };

      let profileImageBlob: any = this.selectedFile
        ? new Blob([this.selectedFile], { type: this.selectedFile.type })
        : null;

      if (this.isEditing && this.selectedCV?.id !== undefined) {
        this.cvService
          .updateCV(this.selectedCV.id, cvRequest, profileImageBlob)
          .subscribe({
            next: () => {
              this.fetchCVs();
              this.clearForm();
              this.isEditing = false;
            },
            error: (error) => console.error('Error updating CV:', error),
          });
      } else {
        this.cvService.createCV(cvRequest, profileImageBlob).subscribe({
          next: () => {
            this.fetchCVs();
            this.clearForm();
          },
          error: (error) => console.error('Error creating CV:', error),
        });
      }
    }
  }

  private clearForm(): void {
    this.cvForm.reset();
    this.selectedFileName = null;
    this.selectedFile = null;
    this.isEditing = false;
    this.selectedCV = null;

    this.experiences.clear();
    this.educations.clear();
    this.socialLinks.clear();
  }

  onDeleteCV(id?: number, fullName?: string) {
    this.cvService.deleteCV(id, fullName).subscribe({
      next: () => this.fetchCVs(),
      error: (error) => console.error('Error deleting CV:', error),
    });
  }

  get experiences(): FormArray {
    return this.cvForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.cvForm.get('educations') as FormArray;
  }

  get socialLinks(): FormArray {
    return this.cvForm.get('socialLinks') as FormArray;
  }

  get emailControl() {
    return this.cvForm.get('email');
  }

  addExperience() {
    const experienceForm = this.fb.group({
      position: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: [''],
    });
    this.experiences.push(experienceForm);
  }

  removeExperience(index: number) {
    this.experiences.removeAt(index);
  }

  addEducation() {
    const educationForm = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
    this.educations.push(educationForm);
  }

  removeEducation(index: number) {
    this.educations.removeAt(index);
  }

  addSocialLink(): void {
    this.socialLinks.push(
      this.fb.group({
        platform: ['', Validators.required],
        url: ['', Validators.required],
        iconClass: [''],
      }),
    );
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  generatePDF(cvId: number): void {
    this.cvService.generatePDF(cvId, 'response').subscribe({
      next: (response: any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `CV_${cvId}.pdf`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        const blob = response.body as Blob;
        this.downloadBlob(blob, filename);
      },
      error: (error) => {
        console.error('Error generating PDF:', error);
      },
      complete: () => {
        console.log('PDF generation completed');
      },
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
