import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
  let mockData: { message: string };

  beforeEach(async () => {
    // Creamos un espía de MatDialogRef
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockData = { message: 'Are you sure you want to proceed?' };

    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct message from data', () => {
    expect(component.data.message).toBe(mockData.message);
  });

  it('should call dialogRef.close(true) when "Confirm" button is clicked', () => {
    component.onConfirm();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close(false) when "Cancel" button is clicked', () => {
    component.onCancel();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
