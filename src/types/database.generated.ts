export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      approval_decisions: {
        Row: {
          approval_decision_id: string;
          correction_request_id: string;
          created_at: string;
          decided_at: string;
          decided_by_user_id: string;
          decision: string;
          reviewer_note: string | null;
          updated_at: string;
        };
        Insert: {
          approval_decision_id?: string;
          correction_request_id: string;
          created_at?: string;
          decided_at?: string;
          decided_by_user_id: string;
          decision: string;
          reviewer_note?: string | null;
          updated_at?: string;
        };
        Update: {
          approval_decision_id?: string;
          correction_request_id?: string;
          created_at?: string;
          decided_at?: string;
          decided_by_user_id?: string;
          decision?: string;
          reviewer_note?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'approval_decisions_decided_by_fk';
            columns: ['decided_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'approval_decisions_request_fk';
            columns: ['correction_request_id'];
            isOneToOne: true;
            referencedRelation: 'correction_requests';
            referencedColumns: ['correction_request_id'];
          },
        ];
      };
      audit_events: {
        Row: {
          action_type: string;
          actor_kind: string;
          actor_label: string | null;
          actor_user_id: string | null;
          affected_campus_id: string | null;
          approval_decision_id: string | null;
          audit_event_id: string;
          changed_field_or_action: string | null;
          correction_change_id: string | null;
          correction_reason_id: string | null;
          correction_request_id: string | null;
          exam_attempt_id: string | null;
          exam_booking_id: string | null;
          metadata: Json;
          new_value: Json | null;
          occurred_at: string;
          previous_value: Json | null;
          student_enrolment_id: string | null;
          student_exam_requirement_id: string | null;
          student_id: string | null;
          target_kind: string;
          target_record_id: string;
        };
        Insert: {
          action_type: string;
          actor_kind: string;
          actor_label?: string | null;
          actor_user_id?: string | null;
          affected_campus_id?: string | null;
          approval_decision_id?: string | null;
          audit_event_id?: string;
          changed_field_or_action?: string | null;
          correction_change_id?: string | null;
          correction_reason_id?: string | null;
          correction_request_id?: string | null;
          exam_attempt_id?: string | null;
          exam_booking_id?: string | null;
          metadata?: Json;
          new_value?: Json | null;
          occurred_at?: string;
          previous_value?: Json | null;
          student_enrolment_id?: string | null;
          student_exam_requirement_id?: string | null;
          student_id?: string | null;
          target_kind: string;
          target_record_id: string;
        };
        Update: {
          action_type?: string;
          actor_kind?: string;
          actor_label?: string | null;
          actor_user_id?: string | null;
          affected_campus_id?: string | null;
          approval_decision_id?: string | null;
          audit_event_id?: string;
          changed_field_or_action?: string | null;
          correction_change_id?: string | null;
          correction_reason_id?: string | null;
          correction_request_id?: string | null;
          exam_attempt_id?: string | null;
          exam_booking_id?: string | null;
          metadata?: Json;
          new_value?: Json | null;
          occurred_at?: string;
          previous_value?: Json | null;
          student_enrolment_id?: string | null;
          student_exam_requirement_id?: string | null;
          student_id?: string | null;
          target_kind?: string;
          target_record_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_events_actor_user_fk';
            columns: ['actor_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'audit_events_attempt_fk';
            columns: ['exam_attempt_id'];
            isOneToOne: false;
            referencedRelation: 'exam_attempts';
            referencedColumns: ['exam_attempt_id'];
          },
          {
            foreignKeyName: 'audit_events_booking_fk';
            columns: ['exam_booking_id'];
            isOneToOne: false;
            referencedRelation: 'exam_bookings';
            referencedColumns: ['exam_booking_id'];
          },
          {
            foreignKeyName: 'audit_events_campus_fk';
            columns: ['affected_campus_id'];
            isOneToOne: false;
            referencedRelation: 'campuses';
            referencedColumns: ['campus_id'];
          },
          {
            foreignKeyName: 'audit_events_change_fk';
            columns: ['correction_change_id'];
            isOneToOne: false;
            referencedRelation: 'correction_changes';
            referencedColumns: ['correction_change_id'];
          },
          {
            foreignKeyName: 'audit_events_decision_fk';
            columns: ['approval_decision_id'];
            isOneToOne: false;
            referencedRelation: 'approval_decisions';
            referencedColumns: ['approval_decision_id'];
          },
          {
            foreignKeyName: 'audit_events_enrolment_fk';
            columns: ['student_enrolment_id'];
            isOneToOne: false;
            referencedRelation: 'student_enrolments';
            referencedColumns: ['student_enrolment_id'];
          },
          {
            foreignKeyName: 'audit_events_reason_fk';
            columns: ['correction_reason_id'];
            isOneToOne: false;
            referencedRelation: 'correction_reasons';
            referencedColumns: ['correction_reason_id'];
          },
          {
            foreignKeyName: 'audit_events_request_fk';
            columns: ['correction_request_id'];
            isOneToOne: false;
            referencedRelation: 'correction_requests';
            referencedColumns: ['correction_request_id'];
          },
          {
            foreignKeyName: 'audit_events_requirement_fk';
            columns: ['student_exam_requirement_id'];
            isOneToOne: false;
            referencedRelation: 'student_exam_requirements';
            referencedColumns: ['student_exam_requirement_id'];
          },
          {
            foreignKeyName: 'audit_events_student_fk';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['student_id'];
          },
        ];
      };
      business_role_permissions: {
        Row: {
          business_role_id: string;
          business_role_permission_id: string;
          created_at: string;
          permission_id: string;
        };
        Insert: {
          business_role_id: string;
          business_role_permission_id?: string;
          created_at?: string;
          permission_id: string;
        };
        Update: {
          business_role_id?: string;
          business_role_permission_id?: string;
          created_at?: string;
          permission_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_role_permissions_business_role_id_fkey';
            columns: ['business_role_id'];
            isOneToOne: false;
            referencedRelation: 'business_roles';
            referencedColumns: ['business_role_id'];
          },
          {
            foreignKeyName: 'business_role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['permission_id'];
          },
        ];
      };
      business_roles: {
        Row: {
          business_role_id: string;
          created_at: string;
          description: string | null;
          is_active: boolean;
          is_demo_only: boolean;
          organisation_id: string;
          retired_at: string | null;
          role_key: string;
          role_name: string;
          updated_at: string;
        };
        Insert: {
          business_role_id?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          is_demo_only?: boolean;
          organisation_id: string;
          retired_at?: string | null;
          role_key: string;
          role_name: string;
          updated_at?: string;
        };
        Update: {
          business_role_id?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          is_demo_only?: boolean;
          organisation_id?: string;
          retired_at?: string | null;
          role_key?: string;
          role_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_roles_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      campus_programme_exam_requirements: {
        Row: {
          campus_programme_exam_requirement_id: string;
          campus_programme_id: string;
          created_at: string;
          display_order: number | null;
          effective_from: string | null;
          effective_to: string | null;
          enrolment_type_id: string;
          exam_id: string;
          is_active: boolean;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          campus_programme_exam_requirement_id?: string;
          campus_programme_id: string;
          created_at?: string;
          display_order?: number | null;
          effective_from?: string | null;
          effective_to?: string | null;
          enrolment_type_id: string;
          exam_id: string;
          is_active?: boolean;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          campus_programme_exam_requirement_id?: string;
          campus_programme_id?: string;
          created_at?: string;
          display_order?: number | null;
          effective_from?: string | null;
          effective_to?: string | null;
          enrolment_type_id?: string;
          exam_id?: string;
          is_active?: boolean;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cper_campus_programme_fk';
            columns: ['campus_programme_id'];
            isOneToOne: false;
            referencedRelation: 'campus_programmes';
            referencedColumns: ['campus_programme_id'];
          },
          {
            foreignKeyName: 'cper_enrolment_type_fk';
            columns: ['enrolment_type_id'];
            isOneToOne: false;
            referencedRelation: 'enrolment_types';
            referencedColumns: ['enrolment_type_id'];
          },
          {
            foreignKeyName: 'cper_exam_fk';
            columns: ['exam_id'];
            isOneToOne: false;
            referencedRelation: 'exams';
            referencedColumns: ['exam_id'];
          },
        ];
      };
      campus_programmes: {
        Row: {
          available_from: string | null;
          available_until: string | null;
          campus_id: string;
          campus_programme_id: string;
          created_at: string;
          is_active: boolean;
          offering_label: string | null;
          programme_id: string;
          updated_at: string;
        };
        Insert: {
          available_from?: string | null;
          available_until?: string | null;
          campus_id: string;
          campus_programme_id?: string;
          created_at?: string;
          is_active?: boolean;
          offering_label?: string | null;
          programme_id: string;
          updated_at?: string;
        };
        Update: {
          available_from?: string | null;
          available_until?: string | null;
          campus_id?: string;
          campus_programme_id?: string;
          created_at?: string;
          is_active?: boolean;
          offering_label?: string | null;
          programme_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campus_programmes_campus_fk';
            columns: ['campus_id'];
            isOneToOne: false;
            referencedRelation: 'campuses';
            referencedColumns: ['campus_id'];
          },
          {
            foreignKeyName: 'campus_programmes_programme_fk';
            columns: ['programme_id'];
            isOneToOne: false;
            referencedRelation: 'programmes';
            referencedColumns: ['programme_id'];
          },
        ];
      };
      campuses: {
        Row: {
          campus_code: string;
          campus_id: string;
          campus_name: string;
          created_at: string;
          display_order: number | null;
          is_active: boolean;
          organisation_id: string;
          retired_at: string | null;
          updated_at: string;
        };
        Insert: {
          campus_code: string;
          campus_id?: string;
          campus_name: string;
          created_at?: string;
          display_order?: number | null;
          is_active?: boolean;
          organisation_id: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Update: {
          campus_code?: string;
          campus_id?: string;
          campus_name?: string;
          created_at?: string;
          display_order?: number | null;
          is_active?: boolean;
          organisation_id?: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campuses_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      correction_changes: {
        Row: {
          application_state: string;
          applied_value: Json | null;
          baseline_value: Json;
          correction_change_id: string;
          correction_request_id: string;
          created_at: string;
          exam_attempt_id: string | null;
          exam_booking_id: string | null;
          field_or_action: string;
          previous_value: Json;
          proposed_value: Json;
          student_enrolment_id: string | null;
          student_exam_requirement_id: string | null;
          student_id: string | null;
          target_updated_at: string | null;
          updated_at: string;
        };
        Insert: {
          application_state?: string;
          applied_value?: Json | null;
          baseline_value?: Json;
          correction_change_id?: string;
          correction_request_id: string;
          created_at?: string;
          exam_attempt_id?: string | null;
          exam_booking_id?: string | null;
          field_or_action: string;
          previous_value?: Json;
          proposed_value?: Json;
          student_enrolment_id?: string | null;
          student_exam_requirement_id?: string | null;
          student_id?: string | null;
          target_updated_at?: string | null;
          updated_at?: string;
        };
        Update: {
          application_state?: string;
          applied_value?: Json | null;
          baseline_value?: Json;
          correction_change_id?: string;
          correction_request_id?: string;
          created_at?: string;
          exam_attempt_id?: string | null;
          exam_booking_id?: string | null;
          field_or_action?: string;
          previous_value?: Json;
          proposed_value?: Json;
          student_enrolment_id?: string | null;
          student_exam_requirement_id?: string | null;
          student_id?: string | null;
          target_updated_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'correction_changes_attempt_fk';
            columns: ['exam_attempt_id'];
            isOneToOne: false;
            referencedRelation: 'exam_attempts';
            referencedColumns: ['exam_attempt_id'];
          },
          {
            foreignKeyName: 'correction_changes_booking_fk';
            columns: ['exam_booking_id'];
            isOneToOne: false;
            referencedRelation: 'exam_bookings';
            referencedColumns: ['exam_booking_id'];
          },
          {
            foreignKeyName: 'correction_changes_enrolment_fk';
            columns: ['student_enrolment_id'];
            isOneToOne: false;
            referencedRelation: 'student_enrolments';
            referencedColumns: ['student_enrolment_id'];
          },
          {
            foreignKeyName: 'correction_changes_request_fk';
            columns: ['correction_request_id'];
            isOneToOne: false;
            referencedRelation: 'correction_requests';
            referencedColumns: ['correction_request_id'];
          },
          {
            foreignKeyName: 'correction_changes_requirement_fk';
            columns: ['student_exam_requirement_id'];
            isOneToOne: false;
            referencedRelation: 'student_exam_requirements';
            referencedColumns: ['student_exam_requirement_id'];
          },
          {
            foreignKeyName: 'correction_changes_student_fk';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['student_id'];
          },
        ];
      };
      correction_reasons: {
        Row: {
          correction_reason_id: string;
          created_at: string;
          description: string | null;
          is_active: boolean;
          organisation_id: string;
          reason_key: string;
          reason_label: string;
          retired_at: string | null;
          updated_at: string;
        };
        Insert: {
          correction_reason_id?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          organisation_id: string;
          reason_key: string;
          reason_label: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Update: {
          correction_reason_id?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          organisation_id?: string;
          reason_key?: string;
          reason_label?: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'correction_reasons_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      correction_requests: {
        Row: {
          affected_campus_id: string | null;
          applied_at: string | null;
          baseline_recorded_at: string;
          change_type: string;
          correction_reason_id: string;
          correction_request_id: string;
          created_at: string;
          reason_detail: string | null;
          requested_at: string;
          requested_by_user_id: string;
          risk_classification: string;
          updated_at: string;
          workflow_state: string;
        };
        Insert: {
          affected_campus_id?: string | null;
          applied_at?: string | null;
          baseline_recorded_at?: string;
          change_type: string;
          correction_reason_id: string;
          correction_request_id?: string;
          created_at?: string;
          reason_detail?: string | null;
          requested_at?: string;
          requested_by_user_id: string;
          risk_classification: string;
          updated_at?: string;
          workflow_state?: string;
        };
        Update: {
          affected_campus_id?: string | null;
          applied_at?: string | null;
          baseline_recorded_at?: string;
          change_type?: string;
          correction_reason_id?: string;
          correction_request_id?: string;
          created_at?: string;
          reason_detail?: string | null;
          requested_at?: string;
          requested_by_user_id?: string;
          risk_classification?: string;
          updated_at?: string;
          workflow_state?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'correction_requests_campus_fk';
            columns: ['affected_campus_id'];
            isOneToOne: false;
            referencedRelation: 'campuses';
            referencedColumns: ['campus_id'];
          },
          {
            foreignKeyName: 'correction_requests_reason_fk';
            columns: ['correction_reason_id'];
            isOneToOne: false;
            referencedRelation: 'correction_reasons';
            referencedColumns: ['correction_reason_id'];
          },
          {
            foreignKeyName: 'correction_requests_requested_by_fk';
            columns: ['requested_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
      enrolment_statuses: {
        Row: {
          created_at: string;
          display_order: number | null;
          enrolment_status_id: string;
          enrolment_status_key: string;
          enrolment_status_name: string;
          is_active: boolean;
          is_terminal: boolean;
          organisation_id: string;
          retired_at: string | null;
          status_category: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number | null;
          enrolment_status_id?: string;
          enrolment_status_key: string;
          enrolment_status_name: string;
          is_active?: boolean;
          is_terminal?: boolean;
          organisation_id: string;
          retired_at?: string | null;
          status_category?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_order?: number | null;
          enrolment_status_id?: string;
          enrolment_status_key?: string;
          enrolment_status_name?: string;
          is_active?: boolean;
          is_terminal?: boolean;
          organisation_id?: string;
          retired_at?: string | null;
          status_category?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrolment_statuses_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      enrolment_types: {
        Row: {
          created_at: string;
          display_order: number | null;
          enrolment_type_id: string;
          enrolment_type_key: string;
          enrolment_type_name: string;
          is_active: boolean;
          organisation_id: string;
          retired_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number | null;
          enrolment_type_id?: string;
          enrolment_type_key: string;
          enrolment_type_name: string;
          is_active?: boolean;
          organisation_id: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_order?: number | null;
          enrolment_type_id?: string;
          enrolment_type_key?: string;
          enrolment_type_name?: string;
          is_active?: boolean;
          organisation_id?: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrolment_types_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      exam_attempts: {
        Row: {
          attempt_sequence: number | null;
          attempt_sequence_basis: string | null;
          capture_source: string;
          captured_at: string;
          captured_by_user_id: string | null;
          created_at: string;
          exam_attempt_id: string;
          exam_booking_id: string | null;
          exam_date: string | null;
          is_voided: boolean;
          notes: string | null;
          outcome: string;
          score: number | null;
          score_unavailable_reason: string | null;
          student_exam_requirement_id: string;
          updated_at: string;
          void_reason: string | null;
          voided_at: string | null;
          voided_by_user_id: string | null;
        };
        Insert: {
          attempt_sequence?: number | null;
          attempt_sequence_basis?: string | null;
          capture_source?: string;
          captured_at?: string;
          captured_by_user_id?: string | null;
          created_at?: string;
          exam_attempt_id?: string;
          exam_booking_id?: string | null;
          exam_date?: string | null;
          is_voided?: boolean;
          notes?: string | null;
          outcome: string;
          score?: number | null;
          score_unavailable_reason?: string | null;
          student_exam_requirement_id: string;
          updated_at?: string;
          void_reason?: string | null;
          voided_at?: string | null;
          voided_by_user_id?: string | null;
        };
        Update: {
          attempt_sequence?: number | null;
          attempt_sequence_basis?: string | null;
          capture_source?: string;
          captured_at?: string;
          captured_by_user_id?: string | null;
          created_at?: string;
          exam_attempt_id?: string;
          exam_booking_id?: string | null;
          exam_date?: string | null;
          is_voided?: boolean;
          notes?: string | null;
          outcome?: string;
          score?: number | null;
          score_unavailable_reason?: string | null;
          student_exam_requirement_id?: string;
          updated_at?: string;
          void_reason?: string | null;
          voided_at?: string | null;
          voided_by_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exam_attempts_booking_requirement_fk';
            columns: ['exam_booking_id', 'student_exam_requirement_id'];
            isOneToOne: false;
            referencedRelation: 'exam_bookings';
            referencedColumns: ['exam_booking_id', 'student_exam_requirement_id'];
          },
          {
            foreignKeyName: 'exam_attempts_captured_by_fk';
            columns: ['captured_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'exam_attempts_requirement_fk';
            columns: ['student_exam_requirement_id'];
            isOneToOne: false;
            referencedRelation: 'student_exam_requirements';
            referencedColumns: ['student_exam_requirement_id'];
          },
          {
            foreignKeyName: 'exam_attempts_voided_by_fk';
            columns: ['voided_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
      exam_bookings: {
        Row: {
          booking_date: string | null;
          booking_source: string;
          booking_status: string;
          cancelled_at: string | null;
          cancelled_by_user_id: string | null;
          cancelled_reason: string | null;
          created_at: string;
          created_by_user_id: string | null;
          exam_booking_id: string;
          is_voided: boolean;
          notes: string | null;
          scheduled_exam_date: string | null;
          student_exam_requirement_id: string;
          updated_at: string;
          void_reason: string | null;
          voided_at: string | null;
          voided_by_user_id: string | null;
        };
        Insert: {
          booking_date?: string | null;
          booking_source?: string;
          booking_status?: string;
          cancelled_at?: string | null;
          cancelled_by_user_id?: string | null;
          cancelled_reason?: string | null;
          created_at?: string;
          created_by_user_id?: string | null;
          exam_booking_id?: string;
          is_voided?: boolean;
          notes?: string | null;
          scheduled_exam_date?: string | null;
          student_exam_requirement_id: string;
          updated_at?: string;
          void_reason?: string | null;
          voided_at?: string | null;
          voided_by_user_id?: string | null;
        };
        Update: {
          booking_date?: string | null;
          booking_source?: string;
          booking_status?: string;
          cancelled_at?: string | null;
          cancelled_by_user_id?: string | null;
          cancelled_reason?: string | null;
          created_at?: string;
          created_by_user_id?: string | null;
          exam_booking_id?: string;
          is_voided?: boolean;
          notes?: string | null;
          scheduled_exam_date?: string | null;
          student_exam_requirement_id?: string;
          updated_at?: string;
          void_reason?: string | null;
          voided_at?: string | null;
          voided_by_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exam_bookings_cancelled_by_fk';
            columns: ['cancelled_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'exam_bookings_created_by_fk';
            columns: ['created_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'exam_bookings_requirement_fk';
            columns: ['student_exam_requirement_id'];
            isOneToOne: false;
            referencedRelation: 'student_exam_requirements';
            referencedColumns: ['student_exam_requirement_id'];
          },
          {
            foreignKeyName: 'exam_bookings_voided_by_fk';
            columns: ['voided_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
      exam_providers: {
        Row: {
          created_at: string;
          exam_provider_id: string;
          is_active: boolean;
          organisation_id: string;
          provider_key: string | null;
          provider_name: string;
          retired_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          exam_provider_id?: string;
          is_active?: boolean;
          organisation_id: string;
          provider_key?: string | null;
          provider_name: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          exam_provider_id?: string;
          is_active?: boolean;
          organisation_id?: string;
          provider_key?: string | null;
          provider_name?: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exam_providers_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      exam_source_labels: {
        Row: {
          created_at: string;
          exam_id: string | null;
          exam_source_label_id: string;
          mapping_provenance: string | null;
          mapping_reviewed_at: string | null;
          mapping_reviewed_by_user_id: string | null;
          mapping_status: string;
          notes: string | null;
          organisation_id: string;
          source_column_label: string | null;
          source_context: string;
          source_label: string;
          source_system: string;
          source_table_name: string | null;
          source_workbook_range: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          exam_id?: string | null;
          exam_source_label_id?: string;
          mapping_provenance?: string | null;
          mapping_reviewed_at?: string | null;
          mapping_reviewed_by_user_id?: string | null;
          mapping_status?: string;
          notes?: string | null;
          organisation_id: string;
          source_column_label?: string | null;
          source_context: string;
          source_label: string;
          source_system?: string;
          source_table_name?: string | null;
          source_workbook_range?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          exam_id?: string | null;
          exam_source_label_id?: string;
          mapping_provenance?: string | null;
          mapping_reviewed_at?: string | null;
          mapping_reviewed_by_user_id?: string | null;
          mapping_status?: string;
          notes?: string | null;
          organisation_id?: string;
          source_column_label?: string | null;
          source_context?: string;
          source_label?: string;
          source_system?: string;
          source_table_name?: string | null;
          source_workbook_range?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exam_source_labels_exam_fk';
            columns: ['exam_id'];
            isOneToOne: false;
            referencedRelation: 'exams';
            referencedColumns: ['exam_id'];
          },
          {
            foreignKeyName: 'exam_source_labels_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
          {
            foreignKeyName: 'exam_source_labels_reviewer_fk';
            columns: ['mapping_reviewed_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
      exams: {
        Row: {
          created_at: string;
          description: string | null;
          exam_code: string | null;
          exam_id: string;
          exam_name: string;
          exam_provider_id: string | null;
          is_active: boolean;
          is_retired: boolean;
          organisation_id: string;
          passing_score: number | null;
          retired_at: string | null;
          score_scale_label: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          exam_code?: string | null;
          exam_id?: string;
          exam_name: string;
          exam_provider_id?: string | null;
          is_active?: boolean;
          is_retired?: boolean;
          organisation_id: string;
          passing_score?: number | null;
          retired_at?: string | null;
          score_scale_label?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          exam_code?: string | null;
          exam_id?: string;
          exam_name?: string;
          exam_provider_id?: string | null;
          is_active?: boolean;
          is_retired?: boolean;
          organisation_id?: string;
          passing_score?: number | null;
          retired_at?: string | null;
          score_scale_label?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exams_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
          {
            foreignKeyName: 'exams_provider_fk';
            columns: ['exam_provider_id'];
            isOneToOne: false;
            referencedRelation: 'exam_providers';
            referencedColumns: ['exam_provider_id'];
          },
        ];
      };
      organisations: {
        Row: {
          created_at: string;
          is_active: boolean;
          organisation_id: string;
          organisation_key: string;
          organisation_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          is_active?: boolean;
          organisation_id?: string;
          organisation_key: string;
          organisation_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          is_active?: boolean;
          organisation_id?: string;
          organisation_key?: string;
          organisation_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number | null;
          is_active: boolean;
          permission_id: string;
          permission_key: string;
          permission_name: string;
          scope_kind: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean;
          permission_id?: string;
          permission_key: string;
          permission_name: string;
          scope_kind: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean;
          permission_id?: string;
          permission_key?: string;
          permission_name?: string;
          scope_kind?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programmes: {
        Row: {
          created_at: string;
          description: string | null;
          display_order: number | null;
          is_active: boolean;
          organisation_id: string;
          programme_code: string;
          programme_id: string;
          programme_name: string;
          retired_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean;
          organisation_id: string;
          programme_code: string;
          programme_id?: string;
          programme_name: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean;
          organisation_id?: string;
          programme_code?: string;
          programme_id?: string;
          programme_name?: string;
          retired_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'programmes_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      student_enrolments: {
        Row: {
          academic_year: number | null;
          campus_programme_id: string;
          created_at: string;
          end_date: string | null;
          enrolment_status_id: string;
          enrolment_type_id: string;
          intake_label: string | null;
          start_date: string | null;
          student_enrolment_id: string;
          student_id: string;
          trainer_label: string | null;
          trainer_user_id: string | null;
          updated_at: string;
        };
        Insert: {
          academic_year?: number | null;
          campus_programme_id: string;
          created_at?: string;
          end_date?: string | null;
          enrolment_status_id: string;
          enrolment_type_id: string;
          intake_label?: string | null;
          start_date?: string | null;
          student_enrolment_id?: string;
          student_id: string;
          trainer_label?: string | null;
          trainer_user_id?: string | null;
          updated_at?: string;
        };
        Update: {
          academic_year?: number | null;
          campus_programme_id?: string;
          created_at?: string;
          end_date?: string | null;
          enrolment_status_id?: string;
          enrolment_type_id?: string;
          intake_label?: string | null;
          start_date?: string | null;
          student_enrolment_id?: string;
          student_id?: string;
          trainer_label?: string | null;
          trainer_user_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_enrolments_campus_programme_fk';
            columns: ['campus_programme_id'];
            isOneToOne: false;
            referencedRelation: 'campus_programmes';
            referencedColumns: ['campus_programme_id'];
          },
          {
            foreignKeyName: 'student_enrolments_status_fk';
            columns: ['enrolment_status_id'];
            isOneToOne: false;
            referencedRelation: 'enrolment_statuses';
            referencedColumns: ['enrolment_status_id'];
          },
          {
            foreignKeyName: 'student_enrolments_student_fk';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['student_id'];
          },
          {
            foreignKeyName: 'student_enrolments_trainer_fk';
            columns: ['trainer_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'student_enrolments_type_fk';
            columns: ['enrolment_type_id'];
            isOneToOne: false;
            referencedRelation: 'enrolment_types';
            referencedColumns: ['enrolment_type_id'];
          },
        ];
      };
      student_exam_requirements: {
        Row: {
          applicability: string;
          assigned_at: string;
          assigned_by_user_id: string | null;
          assignment_source: string;
          created_at: string;
          effective_from: string | null;
          effective_to: string | null;
          exam_id: string;
          exam_source_label_id: string | null;
          exception_reason: string | null;
          originating_campus_programme_exam_requirement_id: string | null;
          student_enrolment_id: string;
          student_exam_requirement_id: string;
          updated_at: string;
        };
        Insert: {
          applicability?: string;
          assigned_at?: string;
          assigned_by_user_id?: string | null;
          assignment_source: string;
          created_at?: string;
          effective_from?: string | null;
          effective_to?: string | null;
          exam_id: string;
          exam_source_label_id?: string | null;
          exception_reason?: string | null;
          originating_campus_programme_exam_requirement_id?: string | null;
          student_enrolment_id: string;
          student_exam_requirement_id?: string;
          updated_at?: string;
        };
        Update: {
          applicability?: string;
          assigned_at?: string;
          assigned_by_user_id?: string | null;
          assignment_source?: string;
          created_at?: string;
          effective_from?: string | null;
          effective_to?: string | null;
          exam_id?: string;
          exam_source_label_id?: string | null;
          exception_reason?: string | null;
          originating_campus_programme_exam_requirement_id?: string | null;
          student_enrolment_id?: string;
          student_exam_requirement_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ser_assigned_by_fk';
            columns: ['assigned_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'ser_exam_fk';
            columns: ['exam_id'];
            isOneToOne: false;
            referencedRelation: 'exams';
            referencedColumns: ['exam_id'];
          },
          {
            foreignKeyName: 'ser_origin_requirement_exam_fk';
            columns: ['originating_campus_programme_exam_requirement_id', 'exam_id'];
            isOneToOne: false;
            referencedRelation: 'campus_programme_exam_requirements';
            referencedColumns: ['campus_programme_exam_requirement_id', 'exam_id'];
          },
          {
            foreignKeyName: 'ser_source_label_fk';
            columns: ['exam_source_label_id'];
            isOneToOne: false;
            referencedRelation: 'exam_source_labels';
            referencedColumns: ['exam_source_label_id'];
          },
          {
            foreignKeyName: 'ser_student_enrolment_fk';
            columns: ['student_enrolment_id'];
            isOneToOne: false;
            referencedRelation: 'student_enrolments';
            referencedColumns: ['student_enrolment_id'];
          },
        ];
      };
      students: {
        Row: {
          archived_at: string | null;
          archived_by_user_id: string | null;
          created_at: string;
          display_name: string;
          is_archived: boolean;
          organisation_id: string;
          student_id: string;
          student_number: string;
          updated_at: string;
        };
        Insert: {
          archived_at?: string | null;
          archived_by_user_id?: string | null;
          created_at?: string;
          display_name: string;
          is_archived?: boolean;
          organisation_id: string;
          student_id?: string;
          student_number: string;
          updated_at?: string;
        };
        Update: {
          archived_at?: string | null;
          archived_by_user_id?: string | null;
          created_at?: string;
          display_name?: string;
          is_archived?: boolean;
          organisation_id?: string;
          student_id?: string;
          student_number?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'students_archived_by_fk';
            columns: ['archived_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'students_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      user_campus_access: {
        Row: {
          campus_id: string;
          created_at: string;
          grant_status: string;
          granted_at: string;
          granted_by_user_id: string | null;
          notes: string | null;
          revoked_at: string | null;
          revoked_by_user_id: string | null;
          updated_at: string;
          user_campus_access_id: string;
          user_profile_id: string;
        };
        Insert: {
          campus_id: string;
          created_at?: string;
          grant_status?: string;
          granted_at?: string;
          granted_by_user_id?: string | null;
          notes?: string | null;
          revoked_at?: string | null;
          revoked_by_user_id?: string | null;
          updated_at?: string;
          user_campus_access_id?: string;
          user_profile_id: string;
        };
        Update: {
          campus_id?: string;
          created_at?: string;
          grant_status?: string;
          granted_at?: string;
          granted_by_user_id?: string | null;
          notes?: string | null;
          revoked_at?: string | null;
          revoked_by_user_id?: string | null;
          updated_at?: string;
          user_campus_access_id?: string;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'uca_campus_fk';
            columns: ['campus_id'];
            isOneToOne: false;
            referencedRelation: 'campuses';
            referencedColumns: ['campus_id'];
          },
          {
            foreignKeyName: 'uca_granted_by_fk';
            columns: ['granted_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'uca_revoked_by_fk';
            columns: ['revoked_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'uca_user_profile_fk';
            columns: ['user_profile_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          account_status: string;
          archived_at: string | null;
          auth_user_id: string | null;
          created_at: string;
          display_name: string;
          email: string | null;
          is_demo_account: boolean;
          organisation_id: string;
          suspended_at: string | null;
          updated_at: string;
          user_profile_id: string;
        };
        Insert: {
          account_status?: string;
          archived_at?: string | null;
          auth_user_id?: string | null;
          created_at?: string;
          display_name: string;
          email?: string | null;
          is_demo_account?: boolean;
          organisation_id: string;
          suspended_at?: string | null;
          updated_at?: string;
          user_profile_id?: string;
        };
        Update: {
          account_status?: string;
          archived_at?: string | null;
          auth_user_id?: string | null;
          created_at?: string;
          display_name?: string;
          email?: string | null;
          is_demo_account?: boolean;
          organisation_id?: string;
          suspended_at?: string | null;
          updated_at?: string;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_profiles_organisation_fk';
            columns: ['organisation_id'];
            isOneToOne: false;
            referencedRelation: 'organisations';
            referencedColumns: ['organisation_id'];
          },
        ];
      };
      user_role_assignments: {
        Row: {
          assigned_at: string;
          assigned_by_user_id: string | null;
          assignment_status: string;
          business_role_id: string;
          campus_id: string | null;
          created_at: string;
          notes: string | null;
          revoked_at: string | null;
          revoked_by_user_id: string | null;
          role_scope_kind: string;
          updated_at: string;
          user_campus_access_id: string | null;
          user_profile_id: string;
          user_role_assignment_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by_user_id?: string | null;
          assignment_status?: string;
          business_role_id: string;
          campus_id?: string | null;
          created_at?: string;
          notes?: string | null;
          revoked_at?: string | null;
          revoked_by_user_id?: string | null;
          role_scope_kind: string;
          updated_at?: string;
          user_campus_access_id?: string | null;
          user_profile_id: string;
          user_role_assignment_id?: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by_user_id?: string | null;
          assignment_status?: string;
          business_role_id?: string;
          campus_id?: string | null;
          created_at?: string;
          notes?: string | null;
          revoked_at?: string | null;
          revoked_by_user_id?: string | null;
          role_scope_kind?: string;
          updated_at?: string;
          user_campus_access_id?: string | null;
          user_profile_id?: string;
          user_role_assignment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ura_assigned_by_fk';
            columns: ['assigned_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'ura_business_role_fk';
            columns: ['business_role_id'];
            isOneToOne: false;
            referencedRelation: 'business_roles';
            referencedColumns: ['business_role_id'];
          },
          {
            foreignKeyName: 'ura_campus_access_fk';
            columns: ['user_campus_access_id', 'user_profile_id', 'campus_id'];
            isOneToOne: false;
            referencedRelation: 'user_campus_access';
            referencedColumns: ['user_campus_access_id', 'user_profile_id', 'campus_id'];
          },
          {
            foreignKeyName: 'ura_campus_fk';
            columns: ['campus_id'];
            isOneToOne: false;
            referencedRelation: 'campuses';
            referencedColumns: ['campus_id'];
          },
          {
            foreignKeyName: 'ura_revoked_by_fk';
            columns: ['revoked_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
          {
            foreignKeyName: 'ura_user_profile_fk';
            columns: ['user_profile_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['user_profile_id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_view_identifiable_record: {
        Args: { target_kind: string; target_record_id: string };
        Returns: boolean;
      };
      current_user_profile_id: { Args: never; Returns: string };
      get_my_account_access_state: {
        Args: never;
        Returns: {
          account_status: string;
          display_name: string;
          is_demo_account: boolean;
          profile_exists: boolean;
          user_profile_id: string;
        }[];
      };
      get_my_authorization_context: { Args: never; Returns: Json };
      get_organisation_statistics: {
        Args: never;
        Returns: {
          attempt_count: number;
          booking_count: number;
          enrolment_count: number;
          failed_attempt_count: number;
          passed_attempt_count: number;
          student_count: number;
        }[];
      };
      has_permission: {
        Args: { permission_key: string; target_campus_id?: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
