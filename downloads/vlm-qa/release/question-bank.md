# HOI-QA50: Complete English Question Bank

Version 3.0.0. Each question detects a defect. DEFECT and UNCERTAIN receive zero credit; N/A is excluded.

## C01 · C

**Question:** Does the person perform the primary interaction on the wrong object?

**Applies when:** The action specification or conditioning input identifies a target object.

**FAIL condition:** The primary interaction object is not the specified target, or the person operates only another object.

**Critical flag:** true

## C02 · C

**Question:** Does the required primary interaction action fail to start at all?

**Applies when:** Every video with a target HOI action.

**FAIL condition:** The person makes no recognizable attempt to perform the action on the target object.

**Critical flag:** true

## C03 · C

**Question:** Does the person only approach or pose without reaching the action's defining interaction event?

**Applies when:** The action has a defining event such as grasping, wearing, opening, lifting, or placing.

**FAIL condition:** The defining interaction event required by the action specification never occurs.

**Critical flag:** true

## C04 · C

**Question:** Does the object fail to reach the final state required by the action specification?

**Applies when:** The action specification defines an observable final state.

**FAIL condition:** Before the video ends, the target object does not reach the required final position, pose, or functional state.

**Critical flag:** true

## C05 · C

**Question:** Is the body part performing the primary action inconsistent with the action specification?

**Applies when:** The action explicitly or inherently requires a particular body part.

**FAIL condition:** The primary action is performed by the wrong body part.

**Critical flag:** false

## C06 · C

**Question:** Is the left or right hand used for the action inconsistent with the action specification?

**Applies when:** The action specification explicitly states left or right hand.

**FAIL condition:** The action is performed with the opposite hand from the specified side.

**Critical flag:** false

## C07 · C

**Question:** Is the number of hands participating in the primary action inconsistent with the action specification?

**Applies when:** The action explicitly or inherently requires one hand or two hands.

**FAIL condition:** The action requires one hand but uses two, or requires two hands but only one participates.

**Critical flag:** false

## C08 · C

**Question:** Do the required sub-actions occur in the wrong order?

**Applies when:** The action contains two or more sub-actions with a required order.

**FAIL condition:** At least one required sub-action occurs before its prerequisite, invalidating the action logic.

**Critical flag:** true

## C09 · C

**Question:** Is the object's motion direction opposite to the direction specified by the action?

**Applies when:** The action specifies a direction such as up, down, left, right, clockwise, or counterclockwise.

**FAIL condition:** The primary object motion is clearly opposite to the specified direction.

**Critical flag:** false

## C10 · C

**Question:** Is a required sustained action state lost before the specified phase ends?

**Applies when:** The action requires holding, wearing, supporting, or maintaining an object state for a period.

**FAIL condition:** The required state clearly ends before the specified phase is over and is not plausibly restored.

**Critical flag:** true

## S01 · S

**Question:** During a phase that requires contact, does the specified body part never contact the target object?

**Applies when:** The action contains a phase that requires body-object contact.

**FAIL condition:** Throughout the key phase, the specified body part remains visibly separated from the target object.

**Critical flag:** true

## S02 · S

**Question:** While contact must be maintained, is there a clear air gap between the hand and the object surface?

**Applies when:** The hand must remain in contact during a key phase and the contact region is visible.

**FAIL condition:** At least one clear frame shows a visible nonzero gap where the hand should contact the object surface.

**Critical flag:** true

## S03 · S

**Question:** When hand or body support is required, does the object float without any visible support?

**Applies when:** The object should not self-float and the phase requires a hand, body part, or visible surface to oppose gravity.

**FAIL condition:** The object is clearly separated from every possible support yet remains suspended or stably stationary.

**Critical flag:** true

## S04 · S

**Question:** Does the object translate or rotate as if controlled by the hand while clearly detached from it?

**Applies when:** The object's motion should be caused by the hand grasping, pushing, pulling, or supporting it.

**FAIL condition:** A clear hand-object gap exists while the object continues to copy the hand's control trajectory.

**Critical flag:** true

## S05 · S

**Question:** Does required contact break unexpectedly before the action is complete?

**Applies when:** The action requires continuous contact from contact establishment until completion.

**FAIL condition:** Contact clearly breaks before the completion event even though the action does not require release.

**Critical flag:** true

## S06 · S

**Question:** Does the hand or a finger visibly penetrate into the solid interior of the target object?

**Applies when:** The hand-object boundary is visible at one or more key moments.

**FAIL condition:** The hand or finger crosses the outer surface into a rigid solid interior without the action requiring insertion.

**Critical flag:** true

## S07 · S

**Question:** Does the target object visibly penetrate an unintended body region?

**Applies when:** The target object approaches the torso, arm, leg, or another body region not intended for contact.

**FAIL condition:** The object surface crosses the body boundary into body volume without the action requiring it.

**Critical flag:** true

## S08 · S

**Question:** Do the hand and object fuse into an inseparable single structure at the contact region?

**Applies when:** The hand-object contact boundary is visible at one or more key moments.

**FAIL condition:** The two-surface boundary becomes uninterpretable because hand texture or geometry continuously melts into the object.

**Critical flag:** true

## S09 · S

**Question:** Is the actual contact located on an object region unsuitable for completing the specified action?

**Applies when:** The action requires contact with a particular functional part or manipulable region.

**FAIL condition:** Contact occurs on a region that cannot produce the required functional effect.

**Critical flag:** false

## S10 · S

**Question:** Is the current grasp or support contact insufficient to oppose the object's gravity?

**Applies when:** The person is grasping, supporting, or suspending an object affected by gravity.

**FAIL condition:** The visible contact lies where it cannot bear the load and no other support explains the object's stability.

**Critical flag:** true

## S11 · S

**Question:** Is the finger-contact distribution incapable of forming the grasp type required by the action?

**Applies when:** The action requires visible fingers to grasp, pinch, clamp, or wrap around the object.

**FAIL condition:** The visible fingers are not positioned to apply the required holding force.

**Critical flag:** false

## S12 · S

**Question:** After placement is complete, does the object fail to contact the intended supporting surface?

**Applies when:** The action requires placing the object on a table, floor, container, or another support surface.

**FAIL condition:** In the completed placement state, a clear gap remains between the object and intended support surface.

**Critical flag:** true

## S13 · S

**Question:** Is the front-back occlusion order at the hand-object boundary inconsistent with their spatial positions?

**Applies when:** The hand and object partially occlude one another during a key phase.

**FAIL condition:** Within the same local relation, the foreground surface is covered by the background surface without motion that could explain the change.

**Critical flag:** false

## S14 · S

**Question:** During continuous contact, does the contact point jump to another object location without a geometric cause?

**Applies when:** Contact is maintained and visible across consecutive frames.

**FAIL condition:** The contact point changes discontinuously without sufficient relative hand-object motion to explain it.

**Critical flag:** false

## S15 · S

**Question:** Does the target object undergo an obvious solid collision with an unintended body part?

**Applies when:** The target object's trajectory approaches a body part not intended for interaction.

**FAIL condition:** The object hits an unintended body part without plausible avoidance, stopping, or collision response.

**Critical flag:** true

## S16 · S

**Question:** After release, does the object remain suspended without a new support?

**Applies when:** The person releases the object and it is not caught by another hand, body part, or surface.

**FAIL condition:** Contact has clearly ended, yet the object remains fixed or suspended against gravity.

**Critical flag:** true

## M01 · M

**Question:** Does the object begin controlled motion before control contact is established?

**Applies when:** The hand should establish contact before pushing, pulling, grasping, or lifting the object.

**FAIL condition:** The object starts moving along the hand's subsequent trajectory before the hand contacts it.

**Critical flag:** true

## M02 · M

**Question:** After contact breaks, does the object continue copying the hand's controlled motion?

**Applies when:** A clear hand-object contact break is observable during motion.

**FAIL condition:** After separation, the object continues on an approximately rigidly synchronized trajectory with the hand.

**Critical flag:** true

## M03 · M

**Question:** During a stable hold, does the object's translation visibly lag behind the holding hand?

**Applies when:** The hand stably holds the object while visible translation occurs.

**FAIL condition:** The holding hand translates first and the object catches up later, creating a visible temporal delay.

**Critical flag:** true

## M04 · M

**Question:** During a stable hold, does the object move without corresponding motion of the holding hand?

**Applies when:** The hand and object are in a stable hold and both motions are observable.

**FAIL condition:** The object undergoes clear rigid motion while the holding hand remains essentially stationary.

**Critical flag:** true

## M05 · M

**Question:** During a stable grasp, does the object slip unexpectedly relative to the palm?

**Applies when:** The action requires a stable grasp and does not call for deliberate sliding or regrasping.

**FAIL condition:** The object moves relative to the palm or fixed fingers without a regrasping action.

**Critical flag:** false

## M06 · M

**Question:** Does the object jitter independently without the motion propagating to the contacting hand?

**Applies when:** The hand and object remain in contact and temporal resolution is sufficient to observe short motions.

**FAIL condition:** The object shows one or more high-frequency position jumps without corresponding motion in the contacting hand.

**Critical flag:** false

## M07 · M

**Question:** Does the target object's position teleport between adjacent moments in a way its velocity cannot explain?

**Applies when:** The target object is identifiable before and after the jump, or its track can be reliably matched across a brief occlusion.

**FAIL condition:** The object appears at a clearly different position without traversing an intermediate path.

**Critical flag:** true

## M08 · M

**Question:** Does the target object's orientation flip discontinuously between adjacent moments without a cause?

**Applies when:** The object's appearance or geometry supports tracking its orientation continuously.

**FAIL condition:** The orientation changes substantially without enough hand or object motion to cause the rotation.

**Critical flag:** false

## M09 · M

**Question:** Does new hand-object contact appear suddenly without the hand approaching the object?

**Applies when:** The video contains a visible transition from separation to contact.

**FAIL condition:** Adjacent moments change from clear separation directly to contact without sufficient approach motion.

**Critical flag:** false

## M10 · M

**Question:** After release, is the object's gravity response implausibly delayed?

**Applies when:** The object has no new support after release and enough post-release video is available.

**FAIL condition:** Contact has ended, but the object does not begin falling or responding until multiple discernible time steps later.

**Critical flag:** true

## M11 · M

**Question:** Does the interaction state suddenly reset to an earlier state without a cause?

**Applies when:** The action progresses through two or more temporally distinguishable states.

**FAIL condition:** The person, hand, or object abruptly returns to a previously completed state without a reversing action.

**Critical flag:** false

## M12 · M

**Question:** After a brief occlusion, does the hand-object relation jump to a state incompatible with the pre-occlusion motion?

**Applies when:** The hand-object relation undergoes a brief occlusion and can be reliably identified before and after it.

**FAIL condition:** After occlusion, contact side, relative position, or grasp state changes in a way the pre-occlusion trajectory cannot explain.

**Critical flag:** true

## A01 · A

**Question:** Does a visible interacting hand have a clearly incorrect number of fingers?

**Applies when:** The interacting fingers are clear enough at one or more key moments to assess their count.

**FAIL condition:** One hand visibly has fewer or more than five fingers, and occlusion does not explain the count.

**Critical flag:** false

## A02 · A

**Question:** Do two or more fingers merge non-anatomically into one structure?

**Applies when:** Finger contours of the interacting hand are visible at one or more key moments.

**FAIL condition:** Fingers that should be separate lack an explainable boundary and form one continuous finger-like structure.

**Critical flag:** false

## A03 · A

**Question:** Does an interacting finger joint bend in a biomechanically impossible direction?

**Applies when:** At least one interacting finger joint pose is sufficiently visible.

**FAIL condition:** A finger joint shows clear backward folding, out-of-range twisting, or an impossible joint connection.

**Critical flag:** true

## A04 · A

**Question:** Does an interacting wrist disconnect from its corresponding forearm?

**Applies when:** The wrist-forearm connection on the interacting side is visible at one or more key moments.

**FAIL condition:** A clear break, floating connection, or incorrect topology appears between wrist and forearm.

**Critical flag:** true

## A05 · A

**Question:** Does an extra hand appear from nowhere during the interaction?

**Applies when:** Enough of the upper body is visible to distinguish the person's existing two hands.

**FAIL condition:** A third hand appears simultaneously or sequentially without correspondence to either normal arm.

**Critical flag:** true

## A06 · A

**Question:** Does an interacting hand disappear when it should be visible and is not occluded?

**Applies when:** Based on its trajectory, the interacting hand should be in frame and is not occluded by an object or the body.

**FAIL condition:** The interacting hand is entirely absent in an unoccluded frame and later reappears without cause.

**Critical flag:** true

## A07 · A

**Question:** Does the interacting arm length change abruptly in a way perspective cannot explain?

**Applies when:** Enough shoulder, elbow, and wrist landmarks on the interacting side are visible over time.

**FAIL condition:** The arm visibly lengthens or shortens to reach the object without perspective or joint motion explaining it.

**Critical flag:** true

## A08 · A

**Question:** Does the interacting hand collapse into an unrecognizable structure?

**Applies when:** The interacting hand is visible at one or more key moments.

**FAIL condition:** Palm and finger topology is largely lost, melted, or replaced by an uninterpretable blob.

**Critical flag:** true

## A09 · A

**Question:** Does the target object disappear without being fully occluded or leaving the frame?

**Applies when:** Based on its trajectory, the target object should remain in frame and is not fully occluded.

**FAIL condition:** The target object is entirely absent when it should be visible and may later reappear without cause.

**Critical flag:** true

## A10 · A

**Question:** Does a second copy of the target object appear without cause during the interaction?

**Applies when:** The input and action specification contain only one target object.

**FAIL condition:** Two target copies appear simultaneously or sequentially without occlusion, reflection, or a pre-existing scene object explaining them.

**Critical flag:** true

## A11 · A

**Question:** Does a rigid target object's geometry deform without the action requiring deformation?

**Applies when:** The target is rigid, or the current action should not change its global shape.

**FAIL condition:** The object's contour or part proportions bend, melt, or stretch in a way viewpoint change cannot explain.

**Critical flag:** false

## A12 · A

**Question:** Does the target object's scale jump between adjacent moments in a way depth change cannot explain?

**Applies when:** The target object is trackable over time and camera or object depth change can be assessed.

**FAIL condition:** The object's image scale suddenly grows or shrinks without corresponding depth or camera motion.

**Critical flag:** false
